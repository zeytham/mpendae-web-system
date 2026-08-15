const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { login, getMe, changePassword, createAdmin } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { loginSchema, changePasswordSchema, createAdminSchema } = require('../validators/auth.schema');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Majaribio mengi ya kuingia. Jaribu tena baada ya dakika 15.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);
router.post('/create-admin', protect, authorize('superadmin'), validate(createAdminSchema), createAdmin);

module.exports = router;