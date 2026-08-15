const router = require('express').Router();
const { getAll, getByForm, upload, update, remove } = require('../controllers/timetable.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadTimetable } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadTimetableSchema, updateTimetableSchema } = require('../validators/timetable.schema');

router.get('/', getAll);
router.get('/form/:form', getByForm);
router.post('/', protect, ...uploadTimetable.single('file'), validate(uploadTimetableSchema), upload);
router.put('/:id', protect, ...uploadTimetable.single('file'), validate(updateTimetableSchema), update);
router.delete('/:id', protect, remove);

module.exports = router;