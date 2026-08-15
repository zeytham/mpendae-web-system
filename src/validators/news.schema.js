const { z } = require('zod');

const createNewsSchema = z.object({
  title: z.string().trim().min(5, 'Kichwa cha habari lazima kiwe angalau herufi 5').max(200),
  content: z.string().trim().min(20, 'Maudhui ni mafupi mno'),
  excerpt: z.string().trim().max(300).optional(),
  category: z.string().trim().min(2).max(50),
  author: z.string().trim().min(2).max(100),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

// Update: fields zote ni optional (partial update), lakini bado zina validation ikiwa zipo
const updateNewsSchema = createNewsSchema.partial();

module.exports = { createNewsSchema, updateNewsSchema };