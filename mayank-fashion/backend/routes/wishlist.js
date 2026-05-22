const router = require('express').Router();
const c = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', c.get);
router.post('/toggle', c.toggle);

module.exports = router;
