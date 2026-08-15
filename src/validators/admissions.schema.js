const { z } = require('zod');

const submitAdmissionSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Tarehe ya kuzaliwa si sahihi'),
  primarySchool: z.string().trim().min(2).max(150),
  kcpeScore: z.coerce.number().min(0).max(500),
  combination: z.string().trim().max(50).optional(),
  parentName: z.string().trim().min(2).max(100),
  parentPhone: z.string().trim().min(9).max(20),
  parentEmail: z.string().trim().toLowerCase().email('Barua pepe ya mzazi si sahihi'),
  address: z.string().trim().min(3).max(200),
});

const updateStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
  notes: z.string().trim().max(500).optional(),
});

module.exports = { submitAdmissionSchema, updateStatusSchema };