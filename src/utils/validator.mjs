import Joi from "joi";
import { CustomError } from "./custom_error_handler.mjs";

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createItemSchema = Joi.object({
  name: Joi.string().max(100).required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  status: Joi.string()
    .valid("allocated", "unallocated", "available")
    .required(),
});

export const updateItemSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  quantity: Joi.number().integer().optional(),
  price: Joi.number().integer().optional(),
  status: Joi.string()
    .valid("allocated", "unallocated", "available")
    .optional(),
});

export const createOrderSchema = Joi.object({
  item: Joi.number().integer().required(),
  order_status: Joi.string()
    .valid("awaiting_payment", "paid", "canceled", "shipped")
    .required(),
  item_quantity: Joi.number().integer().required(),
});

export const updateOrderSchema = Joi.object({
  order_status: Joi.string()
    .valid("awaiting_payment", "paid", "canceled", "shipped")
    .optional(),
  item_quantity: Joi.number().integer().optional(),
});

const joiValidator = async (eventBody, validationSchema) => {
  let response = {
    errors: null,
    isValid: false,
    values: null,
  };

  const result = await validationSchema.validateAsync(eventBody);
  if (result.error) response.errors = result.error.details[0].message;
  else {
    response.isValid = true;
    response.values = result;
  }

  return response;
};

export default joiValidator;
