const { z } = require('zod');

const productCreateSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  price: z.number().positive("Harga harus lebih dari 0"),
  grade: z.enum(['hg', 'mg', 'sd', 'pg', 'rg'], "Grade harus salah satu dari hg, mg, sd, pg, rg")
});

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  grade: z.enum(['hg', 'mg', 'sd', 'pg', 'rg']).optional()
});

module.exports = {
  productCreateSchema,
  productUpdateSchema
};
