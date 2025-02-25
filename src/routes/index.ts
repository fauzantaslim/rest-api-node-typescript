import { Application, Router } from 'express'
import { HealthRoute } from './health.route'
import ProductRoute from './product.routes'
import authRoute from './auth.routes'
const _routes: Array<[string, Router]> = [
  ['/health', HealthRoute],
  ['/products', ProductRoute],
  ['/auth', authRoute]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
