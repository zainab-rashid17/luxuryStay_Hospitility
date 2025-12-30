const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

const router = express.Router();

// @route   GET /api/reports/occupancy
// @desc    Get occupancy rate report
// @access  Private (Admin only)
router.get('/occupancy', protect, authorize('admin'), reportController.getOccupancyReport);

// @route   GET /api/reports/revenue
// @desc    Get revenue report
// @access  Private (Admin only)
router.get('/revenue', protect, authorize('admin'), reportController.getRevenueReport);

// @route   GET /api/reports/reservations
// @desc    Get reservations report
// @access  Private (Admin only)
router.get('/reservations', protect, authorize('admin'), reportController.getReservationsReport);

// @route   GET /api/reports/dashboard
// @desc    Get dashboard summary
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), reportController.getDashboard);

module.exports = router;
