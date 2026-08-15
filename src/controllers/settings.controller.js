const { deleteFromCloudinary } = require('../utils/cloudinary');
const { sendContactMessage } = require('../utils/email');

const prisma = require('../utils/prisma');

const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.schoolSettings.findFirst();
    if (!settings) {
      settings = await prisma.schoolSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await prisma.schoolSettings.findFirst();
    if (!settings) {
      settings = await prisma.schoolSettings.create({ data: {} });
    }

    // req.body imeshapitia updateSettingsSchema — fields za ziada zisizojulikana tayari zimeondolewa
    const updated = await prisma.schoolSettings.update({
      where: { id: settings.id },
      data: req.body,
    });
    res.json({ message: 'Settings updated.', settings: updated });
  } catch (error) {
    next(error);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    let settings = await prisma.schoolSettings.findFirst();
    if (!settings) {
      settings = await prisma.schoolSettings.create({ data: {} });
    }

    if (settings.logoPubId) await deleteFromCloudinary(settings.logoPubId);

    const updated = await prisma.schoolSettings.update({
      where: { id: settings.id },
      data: { logoUrl: req.file.path, logoPubId: req.file.filename },
    });
    res.json({ message: 'Logo updated.', logoUrl: updated.logoUrl });
  } catch (error) {
    next(error);
  }
};

const contactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body; // tayari imepitia contactSchema

    await sendContactMessage({ name, email, subject, message });
    res.json({ message: 'Your message has been sent. We will get back to you soon.' });
  } catch (error) {
    console.error('Contact email error:', error.message);
    res.json({ message: 'Your message has been received.' });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [students, teachers, pendingAdmissions, upcomingEvents, recentNews, recentAdmissions] = await Promise.all([
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { status: 'ACTIVE' } }),
      prisma.admission.count({ where: { status: 'PENDING' } }),
      prisma.event.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
      prisma.news.findMany({ where: { status: 'PUBLISHED' }, take: 5, orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, publishedAt: true, category: true } }),
      prisma.admission.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, firstName: true, lastName: true, status: true, referenceNo: true, createdAt: true } }),
    ]);
    res.json({ students, teachers, pendingAdmissions, upcomingEvents, recentNews, recentAdmissions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings, uploadLogo, contactForm, getDashboardStats };