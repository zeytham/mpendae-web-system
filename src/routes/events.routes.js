const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/events.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createEventSchema, updateEventSchema } = require('../validators/events.schema');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, validate(createEventSchema), create);
router.put('/:id', protect, validate(updateEventSchema), update);
router.delete('/:id', protect, remove);

module.exports = router;