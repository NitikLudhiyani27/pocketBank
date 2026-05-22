const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', c.stats);
router.get('/users', c.users);
router.delete('/users/:id', c.deleteUser);

module.exports = router;
