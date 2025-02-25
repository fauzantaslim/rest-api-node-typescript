import config from '../config/environment'
import mongoose from 'mongoose'
import { logger } from './logger'

mongoose
  .connect(`${config.db}`)
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch((error) => {
    logger.info('failed connect to mongoDB')
    logger.error(error)
    process.exit(1)
  })
