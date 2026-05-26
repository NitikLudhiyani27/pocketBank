const router = require('express').Router();
const {
  signup, login, me, updateProfile,
  forgotPassword, resetPassword, subscribeNewsletter,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/newsletter', subscribeNewsletter);

module.exports = router;
