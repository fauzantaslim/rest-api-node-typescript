import express, { Application, json, urlencoded } from 'express'
import { routes } from '../routes'
import cors from 'cors'
import deserializeToken from '../middleware/deserializedToken'

const createServer = () => {
  const app: Application = express()
  app.use(deserializeToken)
  app.use(json())
  app.use(urlencoded({ extended: false }))
  app.use(cors())
  routes(app)
  return app
}
export default createServer
