import { logger } from './utils/logger'
import './utils/connectDB'
import createServer from './utils/server'

const app = createServer()
const port: number = 3000
const host: string = 'localhost'
app.listen(port, host, () => {
  logger.info(`server running at http://${host}:${port}`)
})
