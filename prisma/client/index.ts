// import PrismaClient dari hasil generate custom output Prisma
import { PrismaClient } from '../../src/generated/prisma/client'

// inisialisasi prisma client
const prisma = new PrismaClient()

// export default prisma agar bisa digunakan di file lain
export default prisma
