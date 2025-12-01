const { z } = require('zod');

const userCreateSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  email: z.string().email("Email tidak valid")
});

const userUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  email: z.string().email().optional()
});

module.exports = {
  userCreateSchema,
  userUpdateSchema
};
