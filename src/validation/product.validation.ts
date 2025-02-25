import Joi from 'joi'
import ProductInterface from '../types/product.type'

export const createProductValidation = (payload: ProductInterface) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    size: Joi.number().min(0).required()
  })
  return schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  })
}

export const updateProductValidation = (payload: ProductInterface) => {
  const schema = Joi.object({
    name: Joi.string().allow('', null),
    price: Joi.number().allow('', null),
    size: Joi.number().allow('', null)
  })
  return schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  })
}
