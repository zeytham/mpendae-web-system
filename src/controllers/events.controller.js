
const prisma = require('../utils/prisma');

const ALLOWED_FIELDS = ['title', 'description', 'location', 'startDate', 'endDate', 'category', 'status'];

const pickAllowed = (body) => {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};

// Awali, kila GET request (hata za wageni, bila auth) zilikuwa zinafanya
// maandishi 2 ya DB (updateMany) kabla ya kusoma events -- hii ni gharama
// isiyo ya lazima ya DB load kwenye endpoint ya public inayoweza kupata
// trafiki nyingi. Sasa tunafanya "sync" hii mara moja tu kila dakika 5
// (kwa process hii), si kwa kila request.
const SYNC_INTERVAL_MS = 5 * 60 * 1000;
let lastStatusSyncAt = 0;

const syncEventStatuses = async () => {
  const now = new Date();
  if (Date.now() - lastStatusSyncAt < SYNC_INTERVAL_MS) return;
  lastStatusSyncAt = Date.now();

  await prisma.event.updateMany({
    where: { startDate: { lte: now }, endDate: { gte: now } },
    data: { status: 'ONGOING' },
  });
  await prisma.event.updateMany({
    where: {
      OR: [
        { endDate: { lt: now } },
        { endDate: null, startDate: { lt: now } },
      ],
      status: { not: 'PAST' },
    },
    data: { status: 'PAST' },
  });
};

const getAll = async (req, res, next) => {
  try {
    const { status = '' } = req.query;

    await syncEventStatuses();

    const where = status ? { status } : {};
    const events = await prisma.event.findMany({
      where, orderBy: { startDate: 'asc' },
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, location, startDate, endDate, category } = req.body;
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    let status = 'UPCOMING';
    if (start <= now && (!end || end >= now)) status = 'ONGOING';
    if (end && end < now) status = 'PAST';

    const event = await prisma.event.create({
      data: { title, description, location, category, status, startDate: start, endDate: end },
    });
    res.status(201).json({ message: 'Event created.', event });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Event not found.' });

    const data = pickAllowed(req.body);
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : existing.startDate,
        endDate: data.endDate ? new Date(data.endDate) : existing.endDate,
      },
    });
    res.json({ message: 'Event updated.', event });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove };