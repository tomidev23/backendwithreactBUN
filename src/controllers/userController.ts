// import type Context dari Hono
import type { Context } from 'hono'

// import prisma client
import prisma from '../../prisma/client'

// import type UserCreateRequest
import type { UserCreateRequest } from '../types/user'

/**
 * @param c 
 * @returns 
 * get all users
 */
export const getUsers = async (c: Context) => {
    try {
        //get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { id: 'desc' }
        });

        //return JSON
        return c.json({
            success: true,
            message: 'List Data Users',
            data: users
        }, 200);

    } catch (e: unknown) {
        console.error(`Error getting users: ${e}`);
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}

/**
 * @param c 
 * @returns 
 * Create a new user
 */
export const createUser = async (c: Context) => {
    try {

        // ekstrak data yang sudah tervalidasi
        const { name, username, email, password } = c.get('validatedBody') as UserCreateRequest;

        // Cek duplikat email / username
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
            select: { id: true, email: true, username: true },
        })

        // Jika ada duplikat, kembalikan error 409 Conflict
        if (existing) {
            const conflictField = existing.email === email ? 'email' : existing.username === username ? 'username' : 'email'
            return c.json(
                {
                    success: false,
                    message:
                        conflictField === 'email'
                            ? 'Email sudah terdaftar'
                            : 'Username sudah digunakan',
                    errors: { [conflictField]: 'Telah digunakan' },
                },
                409
            )
        }

        // Hash password (Bun gunakan Argon2id secara default)
        const hashedPassword = await Bun.password.hash(password)

        // Buat user baru (jangan expose password di select)
        const user = await prisma.user.create({
            data: { name, username, email, password: hashedPassword },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        // return response sukses 201
        return c.json(
            {
                success: true,
                message: 'User Berhasil Dibuat',
                data: user,
            },
            201
        )

    }
    catch (e: unknown) {
        console.error(`Error creating user: ${e}`);
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}

/**
 * @param c
 * @returns
 * Get user by ID
 */
export const getUserById = async (c: Context) => {
    try {
        const id = Number.parseInt(c.req.param('id'), 10)

        if (Number.isNaN(id)) {
            return c.json({ success: false, message: 'ID tidak valid' }, 400)
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!user) {
            return c.json({ success: false, message: 'User tidak ditemukan' }, 404)
        }

        return c.json(
            { success: true, message: 'Detail User', data: user },
            200
        )
    } catch (e: unknown) {
        console.error(`Error getting user by id: ${e}`)
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}

/**
 * @param c
 * @returns
 * Update user by ID
 */
export const updateUser = async (c: Context) => {
    try {
        const id = Number.parseInt(c.req.param('id'), 10)

        if (Number.isNaN(id)) {
            return c.json({ success: false, message: 'ID tidak valid' }, 400)
        }

        const body = c.get('validatedBody') as Partial<{
            name: string
            username: string
            email: string
            password: string
        }>

        const existingUser = await prisma.user.findUnique({ where: { id }, select: { id: true } })
        if (!existingUser) {
            return c.json({ success: false, message: 'User tidak ditemukan' }, 404)
        }

        if (body.email || body.username) {
            const duplicate = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        { OR: [{ email: body.email }, { username: body.username }] },
                    ],
                },
                select: { email: true, username: true },
            })

            if (duplicate) {
                const conflictField =
                    body.email && duplicate.email === body.email ? 'email' : 'username'

                return c.json(
                    {
                        success: false,
                        message:
                            conflictField === 'email'
                                ? 'Email sudah terdaftar'
                                : 'Username sudah digunakan',
                        errors: { [conflictField]: 'Telah digunakan' },
                    },
                    409
                )
            }
        }

        const data: Record<string, unknown> = {}
        if (body.name !== undefined) data.name = body.name
        if (body.username !== undefined) data.username = body.username
        if (body.email !== undefined) data.email = body.email
        if (body.password !== undefined) {
            data.password = await Bun.password.hash(body.password)
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return c.json(
            { success: true, message: 'User berhasil diperbarui', data: user },
            200
        )
    } catch (e: unknown) {
        console.error(`Error updating user: ${e}`)
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}

/**
 * @param c
 * @returns
 * Delete user by ID
 */
export const deleteUser = async (c: Context) => {
    try {
        const id = Number.parseInt(c.req.param('id'), 10)

        if (Number.isNaN(id)) {
            return c.json({ success: false, message: 'ID tidak valid' }, 400)
        }

        const existingUser = await prisma.user.findUnique({ where: { id }, select: { id: true } })
        if (!existingUser) {
            return c.json({ success: false, message: 'User tidak ditemukan' }, 404)
        }

        await prisma.user.delete({ where: { id } })

        return c.json({ success: true, message: 'User berhasil dihapus' }, 200)
    } catch (e: unknown) {
        console.error(`Error deleting user: ${e}`)
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}
