const router = require('express').Router();
const c = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/apply', protect, c.apply);
router.get('/', protect, adminOnly, c.list);
router.post('/', protect, adminOnly, c.create);
router.delete('/:id', protect, adminOnly, c.remove);

module.exports = router;
