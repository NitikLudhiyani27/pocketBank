const router = require('express').Router();
const c = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', c.get);
router.post('/add', c.add);
router.put('/update', c.update);
router.post('/remove', c.remove);
router.delete('/clear', c.clear);

module.exports = router;
