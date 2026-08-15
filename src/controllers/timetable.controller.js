const { deleteFromCloudinary } = require('../utils/cloudinary');

const prisma = require('../utils/prisma');

const ALLOWED_FIELDS = ['title', 'form', 'stream', 'term', 'academicYear'];

const pickAllowed = (body) => {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};

// PDF zilipakiwa Cloudinary kama resource_type 'raw' (angalia upload.middleware.js),
// picha kama 'image'. Ni lazima tutumie hii hii wakati wa kufuta, la sivyo
// destroy() haitapata faili na itashindwa kimya.
const toCloudinaryResourceType = (fileType) => (fileType === 'PDF' ? 'raw' : 'image');

const getAll = async (req, res, next) => {
  try {
    const { form = '' } = req.query;
    const where = form ? { form } : {};
    const timetables = await prisma.timetable.findMany({
      where, orderBy: [{ form: 'asc' }, { term: 'asc' }],
    });
    res.json(timetables);
  } catch (error) {
    next(error);
  }
};

const getByForm = async (req, res, next) => {
  try {
    const { form } = req.params;
    const timetables = await prisma.timetable.findMany({
      where: { form },
      orderBy: { term: 'asc' },
    });
    res.json(timetables);
  } catch (error) {
    next(error);
  }
};

const upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const { title, form, stream, term, academicYear } = req.body;

    const fileType = req.file.mimetype === 'application/pdf' ? 'PDF' : 'IMAGE';

    const timetable = await prisma.timetable.create({
      data: {
        title, form, stream: stream || null, term, academicYear,
        fileUrl: req.file.path,
        publicId: req.file.filename,
        fileType,
      },
    });
    res.status(201).json({ message: 'Timetable uploaded.', timetable });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.timetable.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Timetable not found.' });

    const data = pickAllowed(req.body);
    let fileUrl = existing.fileUrl;
    let publicId = existing.publicId;
    let fileType = existing.fileType;

    if (req.file) {
      await deleteFromCloudinary(existing.publicId, toCloudinaryResourceType(existing.fileType));
      fileUrl = req.file.path;
      publicId = req.file.filename;
      fileType = req.file.mimetype === 'application/pdf' ? 'PDF' : 'IMAGE';
    }

    const timetable = await prisma.timetable.update({
      where: { id },
      data: { ...data, fileUrl, publicId, fileType },
    });
    res.json({ message: 'Timetable updated.', timetable });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const timetable = await prisma.timetable.findUnique({ where: { id: req.params.id } });
    if (!timetable) return res.status(404).json({ error: 'Timetable not found.' });
    await deleteFromCloudinary(timetable.publicId, toCloudinaryResourceType(timetable.fileType));
    await prisma.timetable.delete({ where: { id: req.params.id } });
    res.json({ message: 'Timetable deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getByForm, upload, update, remove };