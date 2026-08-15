const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getAll, getOne, submit, updateStatus, getStats } = require('../controllers/admissions.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { submitAdmissionSchema, updateStatusSchema } = require('../validators/admissions.schema');

// Zuia spam kwenye public submission: max 5 maombi kwa saa 1, kwa IP moja
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Umewasilisha maombi mengi. Jaribu tena baada ya saa 1.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', submitLimiter, validate(submitAdmissionSchema), submit); // Public
router.get('/stats', protect, getStats);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.patch('/:id/status', protect, validate(updateStatusSchema), updateStatus);

module.exports = router;