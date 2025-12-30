const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const billingController = require('../controllers/billingController');
const { validate } = require('../middleware/validate');

const router = express.Router();

// @route   GET /api/billing
// @desc    Get all bills (with filtering)
// @access  Private
router.get('/', protect, billingController.getBills);

// @route   GET /api/billing/:id
// @desc    Get single bill/invoice
// @access  Private
router.get('/:id', protect, billingController.getBill);

// @route   POST /api/billing
// @desc    Create new bill/invoice
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('reservationId').notEmpty(),
  body('roomCharges').isFloat({ min: 0 }),
  body('totalAmount').isFloat({ min: 0 })
], validate, billingController.createBill);

// @route   PUT /api/billing/:id/payment
// @desc    Update payment status
// @access  Private (Admin only)
router.put('/:id/payment', protect, authorize('admin'), [
  body('paymentStatus').isIn(['pending', 'partial', 'paid', 'refunded']),
  body('paymentMethod').optional().isIn(['cash', 'card', 'upi', 'bank-transfer', 'other'])
], validate, billingController.updatePayment);

// @route   PUT /api/billing/:id
// @desc    Update bill
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), billingController.updateBill);

module.exports = router;

