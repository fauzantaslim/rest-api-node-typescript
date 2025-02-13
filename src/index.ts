import express, { Application, json, urlencoded } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import cors from 'cors'
const app: Application = express()
const port: number = 3000
const host: string = 'localhost'
const middlewares = [json(), urlencoded({ extended: false }), cors()]
app.use(middlewares)
routes(app)
app.listen(port, host, () => {
  logger.info(`server running at http://${host}:${port}`)
})
