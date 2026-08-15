const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Barua pepe si sahihi'),
  password: z.string().min(1, 'Password inahitajika'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password mpya lazima iwe angalau herufi 8'),
});

const createAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(2).max(100),
  password: z.string().min(8, 'Password lazima iwe angalau herufi 8'),
});

module.exports = { loginSchema, changePasswordSchema, createAdminSchema };