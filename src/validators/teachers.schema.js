const { z } = require('zod');

const createTeacherSchema = z.object({
  staffId: z.string().trim().max(20).optional(),
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  gender: z.enum(['MALE', 'FEMALE']),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(9).max(20),
  department: z.string().trim().min(2).max(100),
  subjects: z.union([z.string(), z.array(z.string())]).optional(),
  qualification: z.string().trim().min(2).max(150),
  joinedAt: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

const updateTeacherSchema = createTeacherSchema.partial();

module.exports = { createTeacherSchema, updateTeacherSchema };