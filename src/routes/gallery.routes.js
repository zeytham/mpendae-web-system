const router = require('express').Router();
const { getAll, getAlbums, upload, remove } = require('../controllers/gallery.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadGallery } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadGallerySchema } = require('../validators/gallery.schema');

router.get('/', getAll);
router.get('/albums', getAlbums);
router.post('/', protect, ...uploadGallery.array('photos', 20), validate(uploadGallerySchema), upload);
router.delete('/:id', protect, remove);

module.exports = router;
