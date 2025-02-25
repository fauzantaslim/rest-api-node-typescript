import { Router } from 'express'
import { register, createSession, refreshSession } from '../controller/auth.controller'
const authRoute: Router = Router()

authRoute.post('/register', register)
authRoute.post('/login', createSession)
authRoute.post('/refresh', refreshSession)

export default authRoute
