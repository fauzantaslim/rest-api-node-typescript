import 'dotenv/config'

const CONFIG = {
  db: process.env.DB,
  jwtPublic: process.env.JWT_PUBLIC?.replace(/\\n/g, '\n'),
  jwtPrivate: process.env.JWT_PRIVATE?.replace(/\\n/g, '\n')
}
export default CONFIG
