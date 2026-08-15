const { z } = require('zod');

const uploadTimetableSchema = z.object({
  title: z.string().trim().min(3).max(150),
  form: z.enum(['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6']),
  stream: z.string().trim().max(20).optional(),
  term: z.string().trim().min(1).max(20),
  academicYear: z.string().trim().min(4).max(9),
});

const updateTimetableSchema = uploadTimetableSchema.partial();

module.exports = { uploadTimetableSchema, updateTimetableSchema };