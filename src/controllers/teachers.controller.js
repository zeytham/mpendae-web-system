const { deleteFromCloudinary } = require('../utils/cloudinary');

const prisma = require('../utils/prisma');

const ALLOWED_FIELDS = [
  'staffId', 'firstName', 'lastName', 'gender', 'email', 'phone',
  'department', 'qualification', 'joinedAt', 'status',
];

const pickAllowed = (body) => {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};

// UAMUZI (baada ya majadiliano na mmiliki wa mradi): teacher email/phone
// ZINARUHUSIWA kuonekana na public. Hii ni ya makusudi -- tovuti ya umma ina
// ukurasa /staff wenye vitufe vya "Barua"/"Simu" vinavyoruhusu wazazi na
// wanafunzi kuwasiliana moja kwa moja na mwalimu, bila lazima ya kupitia
// ofisi ya shule kwa kila swali dogo. (Awali hapa kulikuwa na kizuizi cha
// PUBLIC_FIELDS kwa kudhani hii ilikuwa leak ya bahati mbaya -- imeondolewa.)

const getAll = async (req, res, next) => {
  try {
    const { search = '', department = '', status = '' } = req.query;
    const where = {
      AND: [
        search ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { staffId: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        department ? { department: { contains: department, mode: 'insensitive' } } : {},
        status ? { status } : {},
      ],
    };
    const teachers = await prisma.teacher.findMany({
      where,
      orderBy: [{ department: 'asc' }, { lastName: 'asc' }],
    });
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
    });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found.' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = pickAllowed(req.body);
    const photoUrl = req.file ? req.file.path : null;
    const photoPubId = req.file ? req.file.filename : null;

    const subjects = typeof req.body.subjects === 'string'
      ? req.body.subjects.split(',').map(s => s.trim())
      : req.body.subjects || [];

    const baseData = {
      ...data,
      subjects,
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : new Date(),
      photo: photoUrl,
      photoPubId,
    };

    let teacher;
    if (data.staffId) {
      teacher = await prisma.teacher.create({ data: baseData });
    } else {
      // Retry-on-conflict kwa sababu ile ile kama students.controller.js:
      // count() peke yake si salama dhidi ya maombi mawili ya wakati mmoja.
      let attempt = 0;
      while (true) {
        attempt++;
        const count = await prisma.teacher.count();
        const staffId = `TCH-${String(count + attempt).padStart(3, '0')}`;
        try {
          teacher = await prisma.teacher.create({ data: { ...baseData, staffId } });
          break;
        } catch (err) {
          if (err.code === 'P2002' && attempt < 5) continue;
          throw err;
        }
      }
    }
    res.status(201).json({ message: 'Teacher added successfully.', teacher });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body);

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Teacher not found.' });

    let photo = existing.photo;
    let photoPubId = existing.photoPubId;
    if (req.file) {
      if (existing.photoPubId) await deleteFromCloudinary(existing.photoPubId);
      photo = req.file.path;
      photoPubId = req.file.filename;
    }

    const subjects = req.body.subjects
      ? (typeof req.body.subjects === 'string' ? req.body.subjects.split(',').map(s => s.trim()) : req.body.subjects)
      : existing.subjects;

    const teacher = await prisma.teacher.update({
      where: { id },
      data: { ...data, subjects, photo, photoPubId },
    });
    res.json({ message: 'Teacher updated successfully.', teacher });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: req.params.id } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found.' });
    if (teacher.photoPubId) await deleteFromCloudinary(teacher.photoPubId);
    await prisma.teacher.delete({ where: { id: req.params.id } });
    res.json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove };