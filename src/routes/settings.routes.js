const router = require('express').Router();
const { getSettings, updateSettings, uploadLogo, contactForm, getDashboardStats } = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { updateSettingsSchema } = require('../validators/settings.schema');
const { contactSchema } = require('../validators/contact.schema');

router.get('/', getSettings);
router.post('/contact', validate(contactSchema), contactForm);
router.get('/dashboard', protect, getDashboardStats);
router.put('/', protect, validate(updateSettingsSchema), updateSettings);
router.post('/logo', protect, ...uploadImage('logo').single('logo'), uploadLogo);

module.exports = router;