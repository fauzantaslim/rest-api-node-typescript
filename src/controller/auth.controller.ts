import { logger } from '../utils/logger'
import { Response, Request } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validation/auth.validation'
import { createUser, findUserByEmail } from '../services/auth.service'
import { v4 as uuidv4 } from 'uuid'
import { checkPassword, hashing } from '../utils/hashing'
import UserInterface from '../types/user.type'
import { signJWT, verifyJWT } from '../utils/jwt'
export const register = async (req: Request, res: Response) => {
  req.body.userId = uuidv4()
  const { error, value } = createUserValidation(req.body)

  if (error) {
    logger.error(`ERR: product - create = ${error.details[0].message}`)
    res.status(422).json({
      status: false,
      errors: error.details.map((err) => ({ field: err.path[0], message: err.message }))
    })
    return
  }
  try {
    value.password = `${hashing(value.password)}`

    await createUser(value)
    logger.info(' auth register success')
    res.status(201).json({
      status: true,
      message: 'Success auth register '
    })
    return
  } catch (error: any) {
    logger.error(`ERR: auth - register = ${error.message}`)
    res.status(500).json({
      status: false,
      errors: error.message
    })
    return
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)

  if (error) {
    logger.error(`ERR: auth - createSession = ${error.details[0].message}`)
    res.status(422).json({
      status: false,
      errors: error.details.map((err) => ({ field: err.path[0], message: err.message }))
    })
    return
  }
  try {
    const result = await findUserByEmail(value.email)
    if (!result) {
      logger.info('email not found')
      res.status(401).json({
        status: false,
        message: 'invalid email or password'
      })
      return
    }

    const user: UserInterface = result

    const isValid = checkPassword(value.password, user.password)
    if (!isValid) {
      logger.info('invalid password')
      res.status(401).json({
        status: false,
        message: 'invalid password'
      })
      return
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user }, { expiresIn: '5s' })

    logger.info(`login success ${user.email}`)
    res.status(200).json({
      status: true,
      message: 'Login Success',
      data: {
        accessToken,
        refreshToken
      }
    })
    return
  } catch (error: any) {
    logger.error(`ERR: auth - createSession = ${error.message}`)
    res.status(500).json({
      status: false,
      errors: error.message
    })
    return
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    logger.error(`ERR: auth - createSession = ${error.details[0].message}`)
    res.status(422).json({
      status: false,
      errors: error.details.map((err) => ({ field: err.path[0], message: err.message }))
    })
    return
  }

  try {
    const { decoded }: any = verifyJWT(value.refreshToken)
    if (!decoded) {
      res.status(401).json({
        status: false,
        message: 'invalid refresh token'
      })
      return
    }
    const user = await findUserByEmail(decoded._doc.email)
    if (!user) {
      return
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })

    logger.info('generate new access token success')
    res.status(200).json({
      status: true,
      message: 'refresh Success',
      data: {
        accessToken
      }
    })
    return
  } catch (error: any) {
    logger.error(`ERR: auth - refreshSession = ${error.message}`)
    res.status(500).json({
      status: false,
      errors: error.message
    })
    return
  }
}
