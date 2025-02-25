import { NextFunction, Request, Response, Router } from 'express'
import { logger } from '../utils/logger'
export const HealthRoute: Router = Router()
HealthRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('health check succes')
  res
    .send({
      status: '200'
    })
    .status(200)
  next()
})
