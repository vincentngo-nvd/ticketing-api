const router = require('express').Router();
const ctrl = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', ctrl.listEvents);
router.get('/:id', ctrl.getEvent);
router.post('/', authenticate, requireRole('ORGANIZER'), ctrl.createEvent);
router.patch('/:id', authenticate, requireRole('ORGANIZER'), ctrl.updateEvent);
router.delete('/:id', authenticate, requireRole('ORGANIZER'), ctrl.deleteEvent);

module.exports = router;