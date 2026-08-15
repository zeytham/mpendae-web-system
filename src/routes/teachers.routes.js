const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/teachers.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTeacherSchema, updateTeacherSchema } = require('../validators/teachers.schema');

// Public: list ya walimu ikiwemo email/phone -- ni feature ya makusudi
// inayoruhusu wazazi/wanafunzi kuwasiliana moja kwa moja na mwalimu
// (angalia frontend /staff page).
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, ...uploadImage('teachers').single('photo'), validate(createTeacherSchema), create);
router.put('/:id', protect, ...uploadImage('teachers').single('photo'), validate(updateTeacherSchema), update);
router.delete('/:id', protect, remove);

module.exports = router;