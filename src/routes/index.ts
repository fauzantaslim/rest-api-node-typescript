import { Application, Router } from 'express'
import { HealthRoute } from './health'
import { ProductRoute } from './product'
const _routes: Array<[string, Router]> = [
  ['/health', HealthRoute],
  ['/products', ProductRoute]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
