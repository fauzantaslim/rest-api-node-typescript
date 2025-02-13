import { Request, Response, Router } from 'express'
import { logger } from '../utils/logger'
export const ProductRoute: Router = Router()
ProductRoute.get('/', (req: Request, res: Response) => {
  logger.info('succes get products')
  res
    .send({
      message: 'success get all products',
      data: {
        products: [
          {
            name: 'Shampoo',
            price: 2000,
            description: 'ini shampoo terbuat dari bahan alami'
          }
        ]
      }
    })
    .status(200)
})

ProductRoute.post('/', (req: Request, res: Response) => {
  logger.info('succes create product')
  const { name, price, description } = req.body
  res
    .send({
      message: 'success create product',
      data: {
        product: {
          name: name,
          price: price,
          description: description
        }
      }
    })
    .status(201)
})
