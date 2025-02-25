import { Request, Response, NextFunction } from 'express'

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user || user._doc.role !== 'admin') {
    res.status(403).json({
      message: `Forbidden: You don't have permission to access this resource`
    })
    return
  }
  return next()
}
