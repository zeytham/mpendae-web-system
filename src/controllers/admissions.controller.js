const { generateRefNumber } = require('../utils/slugify');
const { sendAdmissionConfirmation, sendAdmissionStatusUpdate } = require('../utils/email');

const prisma = require('../utils/prisma');

const getAll = async (req, res, next) => {
  try {
    const { status = '' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [admissions, total] = await Promise.all([
      prisma.admission.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.admission.count({ where }),
    ]);
    res.json({ admissions, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const admission = await prisma.admission.findUnique({ where: { id: req.params.id } });
    if (!admission) return res.status(404).json({ error: 'Admission not found.' });
    res.json(admission);
  } catch (error) {
    next(error);
  }
};

const submit = async (req, res, next) => {
  try {
    // req.body imeshapitia submitAdmissionSchema — fields zote hapa chini ni salama
    const {
      firstName, lastName, gender, dateOfBirth, primarySchool,
      kcpeScore, combination, parentName, parentPhone, parentEmail, address,
    } = req.body;

    const referenceNo = generateRefNumber();

    const admission = await prisma.admission.create({
      data: {
        firstName, lastName, gender,
        dateOfBirth: new Date(dateOfBirth),
        primarySchool, kcpeScore, combination,
        parentName, parentPhone, parentEmail, address,
        referenceNo,
        status: 'PENDING',
      },
    });

    sendAdmissionConfirmation({
      to: parentEmail,
      name: parentName,
      referenceNo,
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({
      message: 'Application submitted successfully.',
      referenceNo,
      admission,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // tayari imepitia updateStatusSchema

    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission) return res.status(404).json({ error: 'Admission not found.' });

    const updated = await prisma.admission.update({
      where: { id },
      data: { status, notes: notes || null },
    });

    sendAdmissionStatusUpdate({
      to: admission.parentEmail,
      name: admission.parentName,
      status,
      notes,
    }).catch(err => console.error('Email error:', err));

    res.json({ message: 'Status updated.', admission: updated });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.admission.count(),
      prisma.admission.count({ where: { status: 'PENDING' } }),
      prisma.admission.count({ where: { status: 'APPROVED' } }),
      prisma.admission.count({ where: { status: 'REJECTED' } }),
    ]);
    res.json({ total, pending, approved, rejected });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, submit, updateStatus, getStats };