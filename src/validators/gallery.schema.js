const { z } = require('zod');

// Gallery upload ni multipart/form-data (pamoja na files), kwa hiyo fields
// za text zinakuja kama string. title/description ni optional kwa sababu
// controller ina default value ('Picha N') ikiwa haijatolewa.
const uploadGallerySchema = z.object({
  album: z.string().trim().min(1).max(100).optional(),
  title: z.string().trim().max(150).optional(),
  description: z.string().trim().max(500).optional(),
});

module.exports = { uploadGallerySchema };
