const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const SystemSettings = require('../models/SystemSettings');
const emailService = require('../utils/emailService');
const notificationController = require('./notificationController');
const Billing = require('../models/Billing');

// @desc    Get all reservations (with filtering)
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    const { status, guestId, roomId, checkInDate, checkOutDate } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (guestId) query.guestId = guestId;
    if (roomId) query.roomId = roomId;
    if (checkInDate) query.checkInDate = { $gte: new Date(checkInDate) };
    if (checkOutDate) query.checkOutDate = { $lte: new Date(checkOutDate) };

    // Guests can only see their own reservations
    if (req.user.role === 'guest') {
      query.guestId = req.user._id;
    }

    const reservations = await Reservation.find(query)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType pricePerNight')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('guestId', 'firstName lastName email phone address')
      .populate('roomId');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Guests can only view their own reservations
    if (req.user.role === 'guest' && reservation.guestId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests, bookingSource } = req.body;
    
    // Validate required fields
    if (!roomId) {
      return res.status(400).json({ message: 'Room is required' });
    }
    if (!checkInDate) {
      return res.status(400).json({ message: 'Check-in date is required' });
    }
    if (!checkOutDate) {
      return res.status(400).json({ message: 'Check-out date is required' });
    }
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (isNaN(checkIn.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in date format' });
    }
    if (isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: 'Invalid check-out date format' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (numberOfGuests > room.maxOccupancy) {
      return res.status(400).json({ message: `Room can only accommodate ${room.maxOccupancy} guests` });
    }

    // Check for conflicting reservations
    const conflictingReservation = await Reservation.findOne({
      roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        { checkInDate: { $lt: checkOut, $gte: checkIn } },
        { checkOutDate: { $gt: checkIn, $lte: checkOut } },
        { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = room.pricePerNight * nights;

    // Determine guestId - staff can create for any guest, guests create for themselves
    const guestId = req.user.role === 'guest' ? req.user._id : (req.body.guestId || req.user._id);

    const reservation = await Reservation.create({
      guestId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalAmount,
      specialRequests,
      bookingSource: bookingSource || 'online'
    });

    // Update room status to reserved
    room.status = 'reserved';
    await room.save();

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType pricePerNight');

    // Send email confirmation if enabled
    try {
      const settings = await SystemSettings.getSettings();
      const guest = populatedReservation.guestId;
      
      if (settings.notificationSettings?.emailNotifications && settings.notificationSettings?.notifyOnBooking) {
        if (guest && guest.email) {
          const emailResult = await emailService.sendReservationConfirmation(populatedReservation, guest);
          if (emailResult.success) {
            console.log('✅ Reservation confirmation email sent to:', guest.email);
          } else {
            console.error('❌ Failed to send reservation email:', emailResult.error || emailResult.message);
          }
        }
      } else {
        console.log('ℹ️  Email notifications disabled in settings');
      }
    } catch (emailError) {
      console.error('Email send error (non-blocking):', emailError.message);
      // Don't fail reservation creation if email fails
    }

    // Create notification for guest
    try {
      console.log('🔔 Creating notification for guest:', guestId);
      const notif = await notificationController.createNotification(
        guestId,
        'booking',
        'Reservation Confirmed',
        `Your reservation #${populatedReservation.confirmationNumber} has been confirmed. Check-in: ${new Date(populatedReservation.checkInDate).toLocaleDateString()}`,
        populatedReservation._id,
        'Reservation'
      );
      if (notif) {
        console.log('✅ Guest notification created successfully');
      } else {
        console.log('⚠️ Guest notification creation returned null');
      }
    } catch (notifError) {
      console.error('❌ Notification creation error (non-blocking):', notifError.message);
      console.error('Error stack:', notifError.stack);
      // Don't fail reservation creation if notification fails
    }

    // Auto-generate Bill/Invoice
    try {
        console.log('💰 Auto-generating bill for reservation:', populatedReservation._id);
        const bill = await Billing.create({
            reservationId: populatedReservation._id,
            guestId: populatedReservation.guestId._id,
            roomCharges: populatedReservation.totalAmount, // Assuming total amount is room charges initially
            additionalServices: [],
            taxes: 0, // Can be updated later
            discount: 0,
            totalAmount: populatedReservation.totalAmount,
            paymentStatus: 'pending',
            invoiceNumber: 'INV' + Date.now().toString().slice(-10) + Math.random().toString(36).substr(2, 3).toUpperCase()
        });

        console.log('✅ Bill generated successfully:', bill._id);

        // Send Invoice Email
        try {
            const settings = await SystemSettings.getSettings();
            if (settings.notificationSettings?.emailNotifications && settings.notificationSettings?.notifyOnBooking) {
                 const populatedBill = await Billing.findById(bill._id)
                    .populate('reservationId')
                    .populate('guestId', 'firstName lastName email');
                
                await emailService.sendInvoice(populatedBill, populatedReservation.guestId, populatedReservation);
                console.log('✅ Invoice email sent');
            }
        } catch (emailErr) {
            console.error('❌ Failed to send invoice email:', emailErr.message);
        }

        // Notify for Bill
        await notificationController.createNotification(
            populatedReservation.guestId._id,
            'payment',
            'New Invoice Generated',
            `Invoice #${bill.invoiceNumber} has been generated for your reservation.`,
            bill._id,
            'Billing'
        );

    } catch (billingError) {
        console.error('❌ Auto-billing failed:', billingError);
        // Don't fail the reservation, just log the error
    }

    // Notify admin/manager if reservation is created by guest
    if (req.user.role === 'guest') {
      try {
        await notificationController.notifyAllAdmins(
          'booking',
          'New Reservation Received',
          `New reservation #${populatedReservation.confirmationNumber} from ${populatedReservation.guestId.firstName} ${populatedReservation.guestId.lastName} for Room ${populatedReservation.roomId.roomNumber} (${populatedReservation.roomId.roomType})`,
          populatedReservation._id,
          'Reservation'
        );
      } catch (adminNotifError) {
        console.error('Admin notification error (non-blocking):', adminNotifError.message);
      }
    }

    res.status(201).json({ success: true, reservation: populatedReservation });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error', 
      error: error.message
    });
  }
};

// @desc    Check-in guest
// @route   PUT /api/reservations/:id/checkin
// @access  Private (Receptionist, Manager, Admin)
exports.checkIn = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('roomId');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed reservations can be checked in' });
    }

    reservation.status = 'checked-in';
    reservation.updatedAt = Date.now();
    await reservation.save();

    // Update room status
    const room = await Room.findById(reservation.roomId._id);
    room.status = 'occupied';
    await room.save();

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType pricePerNight');

    // Notify admin about check-in
    try {
      await notificationController.notifyAllAdmins(
        'checkin',
        'Guest Checked In',
        `${populatedReservation.guestId.firstName} ${populatedReservation.guestId.lastName} checked in to Room ${populatedReservation.roomId.roomNumber} (Reservation #${populatedReservation.confirmationNumber})`,
        populatedReservation._id,
        'Reservation'
      );
    } catch (notifError) {
      console.error('Admin notification error (non-blocking):', notifError.message);
    }

    res.json({ success: true, reservation: populatedReservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check-out guest
// @route   PUT /api/reservations/:id/checkout
// @access  Private (Receptionist, Manager, Admin)
exports.checkOut = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('roomId');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status !== 'checked-in') {
      return res.status(400).json({ message: 'Only checked-in reservations can be checked out' });
    }

    reservation.status = 'checked-out';
    reservation.updatedAt = Date.now();
    await reservation.save();

    // Update room status
    const room = await Room.findById(reservation.roomId._id);
    room.status = 'cleaning';
    await room.save();

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType pricePerNight');

    // Notify admin about check-out
    try {
      await notificationController.notifyAllAdmins(
        'checkout',
        'Guest Checked Out',
        `${populatedReservation.guestId.firstName} ${populatedReservation.guestId.lastName} checked out from Room ${populatedReservation.roomId.roomNumber} (Reservation #${populatedReservation.confirmationNumber}). Room needs cleaning.`,
        populatedReservation._id,
        'Reservation'
      );
    } catch (notifError) {
      console.error('Admin notification error (non-blocking):', notifError.message);
    }

    res.json({ success: true, reservation: populatedReservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Guests can only cancel their own reservations
    if (req.user.role === 'guest') {
      if (reservation.guestId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Guests can only cancel
      if (req.body.status && req.body.status !== 'cancelled') {
        return res.status(403).json({ message: 'Guests can only cancel reservations' });
      }
    }

    // Update fields
    let statusChanged = false;
    let oldStatus = reservation.status;

    if (req.body.status && req.body.status !== reservation.status) {
        reservation.status = req.body.status;
        statusChanged = true;
    }
    if (req.body.specialRequests) reservation.specialRequests = req.body.specialRequests;
    
    reservation.updatedAt = Date.now();
    await reservation.save();

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber roomType pricePerNight');

    // Notify user if status changed
    if (statusChanged) {
        try {
            const message = `Your reservation status has been updated from ${oldStatus} to ${reservation.status}.`;
            
            // 1. In-app Notification
            await notificationController.createNotification(
                reservation.guestId,
                'booking',
                'Reservation Status Updated',
                message,
                reservation._id,
                'Reservation'
            );

            // 2. Email Notification
            const settings = await SystemSettings.getSettings();
            if (settings.notificationSettings?.emailNotifications) {
                 await emailService.sendEmail(
                    populatedReservation.guestId.email,
                    'Reservation Status Update - LuxuryStay',
                    `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #007bff;">Status Update</h2>
                      <p>Dear ${populatedReservation.guestId.firstName},</p>
                      <p>${message}</p>
                      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Confirmation Number:</strong> ${populatedReservation.confirmationNumber}</p>
                        <p><strong>New Status:</strong> ${reservation.status.toUpperCase()}</p>
                      </div>
                      <p>View your reservation details in your dashboard.</p>
                    </div>
                    `
                );
                console.log('✅ Status update email sent');
            }

        } catch (notifError) {
            console.error('❌ Failed to send status update notification:', notifError);
        }
    }

    res.json({ success: true, reservation: populatedReservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

