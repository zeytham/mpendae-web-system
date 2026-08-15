const { verifyToken } = require('../utils/jwt');

const prisma = require('../utils/prisma');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Mpya: kikomo cha role (mfano: 'superadmin' pekee ndiye anaunda admin wapya)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Huna ruhusa ya kufanya hii.' });
    }
    next();
  };
};

// Mpya: kwa endpoints za public zenye taarifa nyeti (mfano: teachers list).
// Tofauti na `protect`, HAIZUII request isiyo na token — inajaribu tu
// kutambua req.user kama token sahihi ipo. Controller inatumia req.user
// kuamua ni fields zipi za kuonyesha (mfano: ficha email/phone kwa wageni).
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (user) req.user = user;
    next();
  } catch (error) {
    // Token mbaya/imeisha muda -> tunaendelea kama mgeni, si kuzuia request
    next();
  }
};

module.exports = { protect, authorize, optionalAuth };