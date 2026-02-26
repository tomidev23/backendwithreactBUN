// import type MiddlewareHandler dari Hono
import type { MiddlewareHandler } from 'hono'

// import verify dari helper JWT bawaan Hono
import { verify } from 'hono/jwt'

export const verifyToken: MiddlewareHandler = async (c, next) => {

    // Ambil header Authorization
    const header = c.req.header('Authorization') || c.req.header('authorization') || ''

    // Dukung format "Bearer xxx" atau token mentah (jika dikirim tanpa prefix)
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : header.trim()

    // Jika token tidak ditemukan
    if (!token) {
        return c.json({ message: 'Unauthenticated.' }, 401)
    }

    try {
        // Ambil secret dari .env
        const secret = process.env.JWT_SECRET || 'default'

        // Verifikasi token menggunakan secret
        const payload = await verify(token, secret, 'HS256')

        // Ambil userId dari payload
        const userId = (payload as any).id ?? (payload as any).sub

        // Simpan userId ke context agar bisa digunakan di route berikutnya
        c.set('userId', userId)

        // Lanjutkan ke handler berikutnya
        await next()
    } catch {
        // Jika token tidak valid
        return c.json({ message: 'Invalid token' }, 401)
    }
}
