const router = require('express').Router();
const { signup, login, me, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);

module.exports = router;
