const { z } = require('zod');

// Generic validator: inachukua Zod schema na kuithibitisha req.body
// Ikifeli, error inapita kwa errorHandler (tayari una ZodError handling huko)
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validate };