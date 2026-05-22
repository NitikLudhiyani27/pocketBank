const router = require('express').Router();
const c = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/product/:id', c.forProduct);
router.post('/', protect, c.create);

module.exports = router;
