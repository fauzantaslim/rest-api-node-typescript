export default interface UserInterface {
  userId?: string | null // Sesuai dengan hasil dari Mongoose
  name: string
  email?: string | null
  password: string
  role: string
}
