const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

module.exports = router;