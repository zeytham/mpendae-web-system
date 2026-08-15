const router = require('express').Router();
const { getPublished, getAll, getBySlug, create, update, togglePublish, remove } = require('../controllers/news.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createNewsSchema, updateNewsSchema } = require('../validators/news.schema');

router.get('/', getPublished);
router.get('/article/:slug', getBySlug);
router.get('/admin/all', protect, getAll);
router.post('/', protect, ...uploadImage('news').single('coverImage'), validate(createNewsSchema), create);
router.put('/:id', protect, ...uploadImage('news').single('coverImage'), validate(updateNewsSchema), update);
router.patch('/:id/publish', protect, togglePublish);
router.delete('/:id', protect, remove);

module.exports = router;