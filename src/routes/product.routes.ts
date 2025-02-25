import { Router } from 'express'

import {
  getAllProductHandler,
  createProductHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductByIdHandler
} from '../controller/product.controller'
import { requireAdmin } from '../middleware/auth'
const ProductRoute: Router = Router()

ProductRoute.get('/', getAllProductHandler)
ProductRoute.get('/:id', getProductByIdHandler)

ProductRoute.post('/', requireAdmin, createProductHandler)
ProductRoute.put('/:id', requireAdmin, updateProductHandler)
ProductRoute.delete('/:id', requireAdmin, deleteProductByIdHandler)

export default ProductRoute
