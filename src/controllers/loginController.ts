// import type Context dari Hono
import type { Context } from 'hono'

// import prisma client
import prisma from '../../prisma/client'

// import type Loginrequest
import type { Loginrequest } from '../auth'

// import sign dari Hono JWT helper
import { sign } from 'hono/jwt'

// controller login
export const login = async (c: Context) => {
    try {
        // ekstrak data yang sudah tervalidasi
        const { username, password } = c.get('validatedBody') as Loginrequest

        // cari user berdasarkan username
        const user = await prisma.user.findUnique({
            where: { username },
        })

        // jika user tidak ditemukan
        if (!user) {
            return c.json(
                {
                    success: false,
                    message: 'User tidak ditemukan',
                },
                401
            )
        }

        // cek password
        const isPasswordValid = user.password 
            ? await Bun.password.verify(password, user.password)
            : false

        // jika password salah
        if (!isPasswordValid) {
            return c.json(
                {
                    success: false,
                    message: 'Password salah',
                },
                401
            )
        }

        // payload JWT dan sign token
        const payload = {
            sub: user.id,   
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
        }

        // get secret dari env atau default
        const secret = process.env.JWT_SECRET || 'default'

        // sign token
        const token = await sign(payload, secret)

        // login sukses, kembalikan data user (tanpa password)
        const { password: _, ...userData } = user

        // return response sukses 200
        return c.json(
            {
                success: true,
                message: 'Login Berhasil!',
                data: {
                    user: userData,
                    token: token,
                },
            },
            200
        )
    } catch (error) {
        // return internal server error
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}
