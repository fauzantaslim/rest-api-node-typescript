import { MongoMemoryServer } from 'mongodb-memory-server'
import supertest from 'supertest'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import { v4 as uuidv4 } from 'uuid'
import { createUser } from '../services/auth.service'
import { hashing } from '../utils/hashing'
const app = createServer()

const userAdmin = {
  userId: uuidv4(),
  email: 'admin@gmail.com',
  name: 'admin',
  password: hashing('admin'),
  role: 'admin'
}
const userRegular = {
  userId: uuidv4(),
  email: 'regular@gmail.com',
  name: 'regular',
  password: hashing('regular'),
  role: 'regular'
}

const userAdminCreate = {
  email: 'admin2@gmail.com',
  name: 'admin',
  password: 'admin',
  role: 'admin'
}
const userRegularCreate = {
  email: 'regular2@gmail.com',
  name: 'regular',
  password: 'regular',
  role: 'regular'
}

const userAdminLogin = {
  email: 'admin@gmail.com',
  password: 'admin'
}

const userLoginNotExist = {
  email: 'regularrrr@gmail.com',
  password: 'regular'
}
describe('auth', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await createUser(userAdmin)
    await createUser(userRegular)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('register', () => {
    describe('create user with role admin', () => {
      it('should return 200,register success', async () => {
        const { statusCode } = await supertest(app).post('/auth/register').send(userAdminCreate)
        expect(statusCode).toBe(201)
      })
    })

    describe('create user with role regular', () => {
      it('should return 200,register success', async () => {
        const { statusCode } = await supertest(app).post('/auth/register').send(userRegularCreate)
        expect(statusCode).toBe(201)
      })
    })
  })

  describe('login', () => {
    describe('login with exist user', () => {
      it('should return 200,return access token & refresh token', async () => {
        const { statusCode } = await supertest(app).post('/auth/login').send(userAdminLogin)
        expect(statusCode).toBe(200)
      })
    })

    describe('login with not exist user', () => {
      it('should return 401,login failed', async () => {
        const { statusCode } = await supertest(app).post('/auth/login').send(userLoginNotExist)
        expect(statusCode).toBe(401)
      })
    })
  })
})
