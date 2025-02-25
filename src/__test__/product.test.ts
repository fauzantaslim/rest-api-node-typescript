import { MongoMemoryServer } from 'mongodb-memory-server'
import supertest from 'supertest'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import { v4 as uuidv4 } from 'uuid'
import { createProduct } from '../services/product.service'
import { createUser } from '../services/auth.service'
import { hashing } from '../utils/hashing'
const app = createServer()

const productPayload = {
  productId: uuidv4(),
  name: 'Kaos Kaki 2',
  price: 5000,
  size: 40
}
console.log('1', productPayload.productId)
const productPayloadCreate = {
  productId: uuidv4(),
  name: 'Kaos Kaki',
  price: 5000,
  size: 40
}

const productPayloadUpdate = {
  price: 4000,
  size: 40
}

const userAdminCreated = {
  userId: uuidv4(),
  email: 'admin@gmail.com',
  name: 'admin',
  password: hashing('admin'),
  role: 'admin'
}
const userRegularCreated = {
  userId: uuidv4(),
  email: 'regular@gmail.com',
  name: 'regular',
  password: hashing('regular'),
  role: 'regular'
}

const userAdmin = {
  email: 'admin@gmail.com',
  password: 'admin'
}

const userRegular = {
  email: 'regular@gmail.com',
  password: 'regular'
}
describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await createProduct(productPayload)
    await createUser(userAdminCreated)
    await createUser(userRegularCreated)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })
  describe('get all product ', () => {
    describe('given the products does exist', () => {
      it('should return 200', async () => {
        const { statusCode } = await supertest(app).get('/products')

        const expectedStatusCode = 200
        expect(statusCode).toBe(expectedStatusCode)
      })
    })
  })
  describe('get detail product ', () => {
    describe('given the product does not exist', () => {
      it('should return 404, and empty data', async () => {
        const productId = 'Product_123'

        const { statusCode } = await supertest(app).get(`/products/${productId}`)

        const expectedStatusCode = 404
        expect(statusCode).toBe(expectedStatusCode)
      })
    })
    describe('given the product does exist', () => {
      it('should return 200, and detail product data', async () => {
        const productId = productPayload.productId
        const { statusCode } = await supertest(app).get(`/products/${productId}`)

        const expectedStatusCode = 200
        expect(statusCode).toBe(expectedStatusCode)
      })
    })
  })

  describe('create product', () => {
    describe('if user is not login ', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).post('/products').send(productPayloadCreate)
        expect(statusCode).toBe(403)
      })
    })

    describe('if user is login as admin', () => {
      it('should return 201, create product success', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const accessToken = body.data.accessToken

        // action
        const { statusCode } = await supertest(app)
          .post('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadCreate)

        //   assert
        expect(statusCode).toBe(201)
      })
    })

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const accessToken = body.data.accessToken

        // action
        const { statusCode } = await supertest(app)
          .post('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadCreate)

        //   assert
        expect(statusCode).toBe(403)
      })
    })
  })

  describe('update product', () => {
    describe('if user is not login ', () => {
      it('should return 403, request forbidden', async () => {
        const productId = productPayload.productId
        const { statusCode } = await supertest(app).put(`/products/${productId}`).send(productPayloadUpdate)
        expect(statusCode).toBe(403)
      })
    })

    describe('if user is login as admin', () => {
      it('should return 200, update product success', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId

        // action
        await supertest(app)
          .put(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate)
          .expect(200)

        const updatedData = await supertest(app)
          .get(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)

        //   assert
        const actualSize = updatedData.body.data.product.size
        const actualPrice = updatedData.body.data.product.price
        expect(actualSize).toBe(productPayloadUpdate.size)
        expect(actualPrice).toBe(productPayloadUpdate.price)
      })

      it('should return 404, product not found ', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId
        // action
        const { statusCode } = await supertest(app)
          .put(`/products/${productId}123`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate)

        //   assert
        expect(statusCode).toBe(404)
      })
    })

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId
        // action
        const { statusCode } = await supertest(app)
          .put(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate)

        //   assert
        expect(statusCode).toBe(403)
      })
    })
  })

  describe('delete product', () => {
    describe('if user is not login ', () => {
      it('should return 403, request forbidden', async () => {
        const productId = productPayload.productId
        const { statusCode } = await supertest(app).delete(`/products/${productId}`)
        expect(statusCode).toBe(403)
      })
    })

    describe('if user is login as admin', () => {
      it('should return 200, delete product success', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId
        // action
        const { statusCode } = await supertest(app)
          .delete(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)

        //   assert
        expect(statusCode).toBe(200)
      })

      it('should return 404, product not found ', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId
        // action
        const { statusCode } = await supertest(app)
          .delete(`/products/${productId}123`)
          .set('Authorization', `Bearer ${accessToken}`)

        //   assert
        expect(statusCode).toBe(404)
      })
    })

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        // arrange
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const accessToken = body.data.accessToken
        const productId = productPayload.productId
        // action
        const { statusCode } = await supertest(app)
          .delete(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)

        //   assert
        expect(statusCode).toBe(403)
      })
    })
  })
})
