const router = require('express').Router();
const { markAttendance, getAttendanceByDate, getStudentAttendance, getReport } = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { markAttendanceSchema } = require('../validators/attendance.schema');

router.use(protect);
router.post('/bulk', validate(markAttendanceSchema), markAttendance);
router.get('/', getAttendanceByDate);
router.get('/report', getReport);
router.get('/student/:studentId', getStudentAttendance);

module.exports = router;
