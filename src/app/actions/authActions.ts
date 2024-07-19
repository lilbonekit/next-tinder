'use server'

import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { redirect } from 'navigation'
import { AuthError, CredentialsSignin } from 'next-auth'
import { ActionResult } from 'types'

import { auth, signIn, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import { LoginSchema } from '@/lib/schemas/loginSchema'
import {
	formRegisterSchema,
	RegisterSchema,
} from '@/lib/schemas/registerSchema'

export async function registerUser(
	data: RegisterSchema
): Promise<ActionResult<User>> {
	try {
		const validated = formRegisterSchema.safeParse(data)

		if (!validated.success) {
			return { status: 'error', error: validated.error.errors }
		}

		const { name, email, password } = validated.data
		const passwordHash = await bcrypt.hash(password, 10)

		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) return { status: 'error', error: 'user-exists' }

		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash,
			},
		})

		return { status: 'success', data: user }
	} catch (error) {
		return { status: 'error', error: 'something-wrong' }
	}
}

// returns a session token
export async function loginUser(
	data: LoginSchema
): Promise<ActionResult<string>> {
	try {
		await signIn('credentials', {
			email: data.email,
			password: data.password,
			redirect: false,
		})

		return { status: 'success', data: 'Logged in' }
	} catch (error) {
		if (error instanceof AuthError) {
			// HACK! Next-Auth returns CallbackRouteError instead of CredentialsSignin
			return error.cause?.err instanceof CredentialsSignin
				? { status: 'error', error: 'invalid-credentials' }
				: { status: 'error', error: 'something-wrong' }
		}
		return { status: 'error', error: 'something-wrong' }
	}
}

export async function signOutUser() {
	await signOut()
	redirect('/login')
}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: { email },
	})
}

export async function getUserById(id: string) {
	return prisma.user.findUnique({
		where: { id },
	})
}

export async function getAuthUserId() {
	const session = await auth()
	const userId = session?.user?.id

	if (!userId) throw new Error('unathorized')

	return userId
}
