const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/teachers.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTeacherSchema, updateTeacherSchema } = require('../validators/teachers.schema');

// Public inaweza kuona list ya walimu (jina, idara, picha) kwa ajili ya
// tovuti ya shule, lakini email/phone zinafichwa isipokuwa umeingia (protect
// upande wa controller kupitia req.user). Angalia teachers.controller.js.
router.get('/', optionalAuth, getAll);
router.get('/:id', optionalAuth, getOne);
router.post('/', protect, ...uploadImage('teachers').single('photo'), validate(createTeacherSchema), create);
router.put('/:id', protect, ...uploadImage('teachers').single('photo'), validate(updateTeacherSchema), update);
router.delete('/:id', protect, remove);

module.exports = router;