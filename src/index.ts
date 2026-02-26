// import Hono
import { Hono } from 'hono'

// import routes utama
import { Routes } from './routes'

// import cors bawaan dari Hono
import { cors } from 'hono/cors'

// instansiasi Hono dengan base path "/api"
const app = new Hono().basePath('/api')

// aktifkan CORS middleware untuk semua endpoint
app.use('*', cors())

// gunakan routes utama
app.route('/', Routes)

// export app
export default app
