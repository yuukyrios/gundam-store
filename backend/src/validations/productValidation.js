import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  grade: Joi.string().valid("HG", "MG", "RG", "PG", "SD").required(),
  price: Joi.number().required(),
  link: Joi.string().uri().required()
});
