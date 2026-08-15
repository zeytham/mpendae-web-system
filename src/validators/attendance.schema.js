const { z } = require('zod');

// markAttendance inapokea JSON (si multipart), kwa hiyo hapa tunaweza
// kutumia types sahihi moja kwa moja (si string zote kama multipart forms).
const attendanceRecordSchema = z.object({
  studentId: z.string().trim().min(1, 'studentId inahitajika'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  notes: z.string().trim().max(300).optional(),
});

const markAttendanceSchema = z.object({
  date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Tarehe si sahihi'),
  records: z.array(attendanceRecordSchema).min(1, 'Angalau mwanafunzi mmoja anahitajika'),
});

module.exports = { markAttendanceSchema };
