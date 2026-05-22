const router = require('express').Router();
const c = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/categories', c.categories);
router.get('/', c.list);
router.get('/:id', c.getOne);
router.get('/:id/recommendations', c.recommend);

router.post('/', protect, adminOnly, c.create);
router.put('/:id', protect, adminOnly, c.update);
router.delete('/:id', protect, adminOnly, c.remove);

module.exports = router;
