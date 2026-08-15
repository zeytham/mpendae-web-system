const { z } = require('zod');

const createStudentSchema = z.object({
  regNumber: z.string().trim().max(30).optional(),
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().refine((v) => !isNaN(Date.parse(v)), 'Tarehe ya kuzaliwa si sahihi'),
  form: z.enum(['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6']),
  stream: z.string().trim().max(20).optional(),
  parentName: z.string().trim().min(2).max(100),
  parentPhone: z.string().trim().min(9).max(20),
  parentEmail: z.string().trim().toLowerCase().email().optional().or(z.literal('')),
  address: z.string().trim().max(200).optional(),
  enrolledAt: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED']).optional(),
});

const updateStudentSchema = createStudentSchema.partial();

module.exports = { createStudentSchema, updateStudentSchema };