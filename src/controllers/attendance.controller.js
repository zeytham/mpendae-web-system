
const prisma = require('../utils/prisma');

const markAttendance = async (req, res, next) => {
  try {
    const { records, date } = req.body;
    // records = [{ studentId, status, notes }]
    if (!records || !Array.isArray(records) || !date) {
      return res.status(400).json({ error: 'Records array and date are required.' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const upsertOps = records.map(({ studentId, status, notes }) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId, date: attendanceDate } },
        create: { studentId, status, notes: notes || null, date: attendanceDate },
        update: { status, notes: notes || null },
      })
    );

    const results = await Promise.all(upsertOps);
    res.json({ message: `Attendance recorded for ${results.length} students.`, count: results.length });
  } catch (error) {
    next(error);
  }
};

const getAttendanceByDate = async (req, res, next) => {
  try {
    const { date, form } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required.' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        date: attendanceDate,
        ...(form && { student: { form } }),
      },
      include: { student: { select: { id: true, firstName: true, lastName: true, regNumber: true, form: true } } },
    });
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const where = {
      studentId,
      ...(startDate && endDate && {
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      }),
    };

    const records = await prisma.attendance.findMany({
      where, orderBy: { date: 'desc' },
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    res.json({ records, summary: { total, present, absent, late, percentage } });
  } catch (error) {
    next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    const { form, startDate, endDate } = req.query;

    const students = await prisma.student.findMany({
      where: { status: 'ACTIVE', ...(form && { form }) },
      include: {
        attendance: {
          where: startDate && endDate ? {
            date: { gte: new Date(startDate), lte: new Date(endDate) },
          } : {},
        },
      },
      orderBy: [{ form: 'asc' }, { lastName: 'asc' }],
    });

    const report = students.map(student => {
      const total = student.attendance.length;
      const present = student.attendance.filter(a => a.status === 'PRESENT').length;
      const absent = student.attendance.filter(a => a.status === 'ABSENT').length;
      const late = student.attendance.filter(a => a.status === 'LATE').length;
      const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        regNumber: student.regNumber,
        form: student.form,
        total, present, absent, late, percentage,
      };
    });

    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getAttendanceByDate, getStudentAttendance, getReport };
