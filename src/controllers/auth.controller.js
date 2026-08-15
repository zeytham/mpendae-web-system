const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

const prisma = require('../utils/prisma');

// Hash "bandia" ya bcrypt (haihusiani na akaunti yoyote). Tunaitumia pale
// email haipo DB, ili bcrypt.compare iendeshwe kila wakati bila kujali email
// ipo au haipo. Bila hii, response ya "email haipo" inarudi haraka zaidi
// kuliko "password si sahihi" (kwa sababu bcrypt.compare inarukwa) -- tofauti
// hiyo ya muda inaweza kutumika kutambua ni email zipi zimesajiliwa (timing attack).
const DUMMY_HASH = '$2a$12$CwTycUXWue0Thq9StjUM0uJ8lgSXwFn2xI/ZuF.YXqYX3T1MDLQ7q';

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const changePassword = async (req, res, next) => {
  try {
    // currentPassword/newPassword tayari zimepitia changePasswordSchema
    // (Zod inahitaji newPassword >= herufi 8) -- hapa hatuhitaji kukagua
    // urefu tena. Awali kulikuwa na kikomo cha herufi 6 hapa ambacho
    // kilikuwa hakitawahi kufikiwa (Zod ingeshazuia kwanza) -- dead code
    // yenye mgongano imeondolewa.
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name and password are required.' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, password: hashed },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    res.status(201).json({ message: 'Admin created successfully.', user });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, changePassword, createAdmin };
