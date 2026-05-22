const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.post('/', c.create);
router.get('/me', c.myOrders);
router.get('/:id', c.getOne);
router.post('/:id/cancel', c.cancel);

router.get('/', adminOnly, c.list);
router.patch('/:id/status', adminOnly, c.updateStatus);

module.exports = router;
