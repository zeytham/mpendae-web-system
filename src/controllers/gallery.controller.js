const { deleteFromCloudinary } = require('../utils/cloudinary');

const prisma = require('../utils/prisma');

const getAll = async (req, res, next) => {
  try {
    const { album = '' } = req.query;
    const where = album ? { album: { contains: album, mode: 'insensitive' } } : {};
    const photos = await prisma.gallery.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(photos);
  } catch (error) {
    next(error);
  }
};

const getAlbums = async (req, res, next) => {
  try {
    const albums = await prisma.gallery.groupBy({ by: ['album'], _count: { id: true } });
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

const upload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const { album = 'Shule', title, description } = req.body;
    const photos = await Promise.all(
      req.files.map((file, i) =>
        prisma.gallery.create({
          data: {
            title: title || `Picha ${i + 1}`,
            imageUrl: file.path,
            publicId: file.filename,
            album,
            description: description || null,
          },
        })
      )
    );
    res.status(201).json({ message: `${photos.length} photo(s) uploaded.`, photos });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const photo = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    await deleteFromCloudinary(photo.publicId);
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ message: 'Photo deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getAlbums, upload, remove };
