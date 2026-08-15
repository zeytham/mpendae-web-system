const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Jina ni fupi mno').max(100),
  email: z.string().trim().toLowerCase().email('Barua pepe si sahihi'),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10, 'Ujumbe ni mfupi mno').max(2000),
});

module.exports = { contactSchema };