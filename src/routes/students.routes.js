const router = require('express').Router();
const { getAll, getOne, create, update, remove, getStats } = require('../controllers/students.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createStudentSchema, updateStudentSchema } = require('../validators/students.schema');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', ...uploadImage('students').single('photo'), validate(createStudentSchema), create);
router.put('/:id', ...uploadImage('students').single('photo'), validate(updateStudentSchema), update);
router.delete('/:id', remove);

module.exports = router;