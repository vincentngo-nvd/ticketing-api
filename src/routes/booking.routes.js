const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.use(authenticate);

router.post('/', requireRole('ATTENDEE'), ctrl.createBooking);
router.get('/me', ctrl.getMyBookings);
router.delete('/:id', ctrl.cancelBooking);

module.exports = router;