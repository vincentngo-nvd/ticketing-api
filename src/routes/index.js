const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/events', require('./event.routes'));
router.use('/bookings', require('./booking.routes'));

module.exports = router;