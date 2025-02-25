import { logger } from '../utils/logger'
import { Response, Request } from 'express'
import { createProductValidation, updateProductValidation } from '../validation/product.validation'
import { getProducts, getProduct, createProduct, updateProductById, deleteProduct } from '../services/product.service'

import { v4 as uuidv4 } from 'uuid'
export const getAllProductHandler = async (req: Request, res: Response) => {
  logger.info('Success get products')
  const products = await getProducts()
  res.status(200).json({
    status: true,
    message: 'Success get all products',
    data: {
      products
    }
  })
  return
}

export const createProductHandler = async (req: Request, res: Response) => {
  req.body.productId = uuidv4()
  const { error, value } = createProductValidation(req.body)

  if (error) {
    logger.error(`ERR: product - create = ${error.details[0].message}`)
    res.status(422).json({
      status: false,
      errors: error.details.map((err) => ({ field: err.path[0], message: err.message }))
    })
    return
  }
  try {
    await createProduct(value)
    logger.info('create product success')
    res.status(201).json({
      status: true,
      message: 'Success create product'
    })
    return
  } catch (error) {
    logger.error(`ERR: product - create = ${error}`)
    res.status(500).json({
      status: false,
      errors: error
    })
    return
  }
}

export const getProductByIdHandler = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req
  const product = await getProduct(id)

  if (product) {
    logger.info('Success get product')
    res.status(200).json({
      status: true,
      message: 'Success get product by id',
      data: {
        product
      }
    })
    return
  }
  logger.info('product not found')
  res.status(404).json({
    status: true,
    message: 'Product not found',
    data: {}
  })
  return
}

export const updateProductHandler = async (req: Request, res: Response) => {
  const { error, value } = updateProductValidation(req.body)
  const {
    params: { id }
  } = req

  if (error) {
    logger.error(`ERR: product - create = ${error.details[0].message}`)
    res.status(422).json({
      status: false,
      errors: error.details.map((err) => ({ field: err.path[0], message: err.message }))
    })
    return
  }

  const updateProduct = await updateProductById(id, value)
  if (updateProduct) {
    logger.info('update product success')
    res.status(200).json({
      status: true,
      message: 'Success update product'
    })
    return
  }
  logger.info('update product failed not found data')
  res.status(404).json({
    status: false,
    message: 'failed update product'
  })
  return
}

export const deleteProductByIdHandler = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req
  const product = await deleteProduct(id)

  if (product) {
    logger.info('Success delete product')
    res.status(200).json({
      status: true,
      message: 'Success delete product by id'
    })
    return
  }
  logger.info('product not found')
  res.status(404).json({
    status: false,
    message: 'failed delete Product'
  })
  return
}
