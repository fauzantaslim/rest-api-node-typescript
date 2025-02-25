import jwt from 'jsonwebtoken'
import CONFIG from '../config/environment'
// Ambil Private & Public Key dari environment

export const signJWT = (payload: object, options?: jwt.SignOptions | undefined) => {
  if (!CONFIG.jwtPrivate) {
    throw new Error('JWT Private Key is missing!')
  }

  return jwt.sign(payload, CONFIG.jwtPrivate, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

export const verifyJWT = (token: string) => {
  if (!CONFIG.jwtPublic) {
    throw new Error('JWT Private Key is missing!')
  }
  try {
    const decoded = jwt.verify(token, CONFIG.jwtPublic)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not eligible to use',
      decoded: null
    }
  }
}
