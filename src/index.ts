import express, { Application, Request, Response } from 'express'

const app: Application = express()
const port: number = 3000
const host: string = 'localhost'

app.use('/', (req: Request, res: Response) => {
  res.status(200).send({
    message: 'welcome'
  })
})

app.listen(port, host, () => {
  console.log(`server running at http://${host}:${port}`)
})
