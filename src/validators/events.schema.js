const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(5).max(2000),
  location: z.string().trim().min(2).max(200),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Tarehe ya kuanza si sahihi'),
  endDate: z.string().optional().refine((v) => !v || !isNaN(Date.parse(v)), 'Tarehe ya kumaliza si sahihi'),
  category: z.string().trim().min(2).max(50),
});

const updateEventSchema = createEventSchema.partial();

module.exports = { createEventSchema, updateEventSchema };