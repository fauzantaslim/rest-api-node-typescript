import productModel from '../models/product.model'
import ProductInterface from '../types/product.type'
export const createProduct = async (payload: ProductInterface) => {
  return await productModel.create(payload)
}
export const getProducts = async () => {
  return await productModel.find()
}

export const getProduct = async (id: string) => {
  return await productModel.findOne({ productId: id })
}

export const updateProductById = async (id: string, payload: ProductInterface) => {
  return await productModel.findOneAndUpdate(
    {
      productId: id
    },
    {
      $set: payload
    }
  )
}

export const deleteProduct = async (id: string) => {
  return await productModel.findOneAndDelete({ productId: id })
}
