import { logger } from '../utils/logger'
import { verifyJWT } from './../utils/jwt'
import { Request, Response, NextFunction } from 'express'
const deserializeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')
    if (!accessToken) {
      return next()
    }
    const token: any = verifyJWT(accessToken)

    if (token.decoded) {
      res.locals.user = token.decoded
      return next()
    }

    if (token.expired) {
      return next()
    }
    // res.status(401).json({ message: 'Invalid token' })
    next()
    return
  } catch (error: any) {
    logger.error('Error verifying token:', error.message)
    res.status(500).json({ message: 'Internal server error' })
    return
  }
}
export default deserializeToken
