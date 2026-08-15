const { z } = require('zod');

const updateSettingsSchema = z.object({
  schoolName: z.string().trim().min(2).max(150).optional(),
  motto: z.string().trim().max(200).optional(),
  address: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  website: z.string().trim().url().optional().or(z.literal('')),
  about: z.string().trim().max(3000).optional(),
  founded: z.string().trim().max(10).optional(),
  principal: z.string().trim().max(100).optional(),
  facebook: z.string().trim().url().optional().or(z.literal('')),
  twitter: z.string().trim().url().optional().or(z.literal('')),
  instagram: z.string().trim().url().optional().or(z.literal('')),
  youtube: z.string().trim().url().optional().or(z.literal('')),
  whatsapp: z.string().trim().max(20).optional(),
});

module.exports = { updateSettingsSchema };