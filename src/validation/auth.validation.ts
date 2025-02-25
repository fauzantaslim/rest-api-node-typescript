import Joi from 'joi'
import UserInterface from '../types/user.type'

export const createUserValidation = (payload: UserInterface) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().min(3).required(),
    password: Joi.string().required(),
    role: Joi.string().allow('', null)
  })
  return schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  })
}

export const createSessionValidation = (payload: UserInterface) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  })
}

export const refreshSessionValidation = (payload: UserInterface) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })
  return schema.validate(payload)
}
