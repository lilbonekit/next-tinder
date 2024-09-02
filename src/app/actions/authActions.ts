/* eslint-disable no-console */
'use server'

import { TokenType, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthError, CredentialsSignin } from 'next-auth'
import { ActionResult } from 'types'

import { auth, signIn, signOut } from '@/auth'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'
import { LoginSchema } from '@/lib/schemas/loginSchema'
import {
	combinedRegisterSchema,
	ProfileSchema,
	RegisterSchema,
} from '@/lib/schemas/registerSchema'
import { generateToken, getTokenByToken } from '@/lib/tokens'

export async function registerUser(
	data: RegisterSchema,
	locale: string
): Promise<ActionResult<User>> {
	try {
		const validated = combinedRegisterSchema.safeParse(data)

		if (!validated.success) {
			return { status: 'error', error: validated.error.errors }
		}

		const {
			name,
			email,
			password,
			gender,
			description,
			dateOfBirth,
			city,
			country,
		} = validated.data
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
				profileComplete: true,
				member: {
					create: {
						name,
						description,
						country,
						city,
						dateOfBirth: new Date(dateOfBirth),
						gender,
					},
				},
			},
		})

		const verificationToken = await generateToken(email, TokenType.VERIFICATION)

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
			locale
		)

		return { status: 'success', data: user }
	} catch (error) {
		return { status: 'error', error: 'something-wrong' }
	}
}

// returns a session token
export async function loginUser(
	data: LoginSchema,
	locale: string
): Promise<ActionResult<string>> {
	try {
		const existingUser = await getUserByEmail(data.email)

		if (!existingUser || !existingUser.email)
			return { status: 'error', error: 'invalid-credentials' }

		if (!existingUser.emailVerified) {
			const token = await generateToken(
				existingUser.email,
				TokenType.VERIFICATION
			)

			await sendVerificationEmail(token.email, token.token, locale)

			return { status: 'error', error: 'not-verified' }
		}

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

export async function verifyEmail(
	token: string
): Promise<ActionResult<string>> {
	try {
		const existingToken = await getTokenByToken(token)
		if (!existingToken) {
			return {
				status: 'error',
				error: 'invalid-token',
			}
		}

		const hasExpired = new Date() > existingToken.expires
		if (hasExpired) {
			return {
				status: 'error',
				error: 'expired-token',
			}
		}

		const existingUser = await getUserByEmail(existingToken.email)
		if (!existingUser) {
			return {
				status: 'error',
				error: 'user-not-found',
			}
		}

		await prisma.user.update({
			where: { id: existingUser.id },
			data: { emailVerified: new Date() },
		})

		await prisma.token.delete({
			where: { id: existingToken.id },
		})

		return { status: 'success', data: 'success' }
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function generateResetPasswordEmail(
	email: string,
	locale: string
): Promise<ActionResult<string>> {
	try {
		const existingUser = await getUserByEmail(email)

		if (!existingUser) {
			return { status: 'error', error: 'email-not-found' }
		}

		const token = await generateToken(email, TokenType.PASSWORD_RESET)

		await sendPasswordResetEmail(token.email, token.token, locale)

		return { status: 'success', data: 'check-email' }
	} catch (error) {
		console.error(error)
		return { status: 'error', error: 'something-wrong' }
	}
}

export async function resetPassword(
	password: string,
	token?: string | null
): Promise<ActionResult<string>> {
	try {
		if (!token) return { status: 'error', error: 'missing-token' }

		const existingToken = await getTokenByToken(token)
		if (!existingToken) {
			return {
				status: 'error',
				error: 'invalid-token',
			}
		}

		const hasExpired = new Date() > existingToken.expires
		if (hasExpired) {
			return {
				status: 'error',
				error: 'expired-token',
			}
		}

		const existingUser = await getUserByEmail(existingToken.email)
		if (!existingUser) {
			return {
				status: 'error',
				error: 'user-not-found',
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await prisma.user.update({
			where: { id: existingUser.id },
			data: { passwordHash: hashedPassword },
		})

		await prisma.token.delete({
			where: { id: existingToken.id },
		})

		return { status: 'success', data: 'password-updated' }
	} catch (error) {
		console.error(error)
		return { status: 'error', error: 'something-wrong' }
	}
}

export async function completeSocialLoginProfile(
	data: ProfileSchema
): Promise<ActionResult<string>> {
	const session = await auth()

	if (!session?.user) return { status: 'error', error: 'user-not-found' }

	try {
		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				profileComplete: true,
				member: {
					create: {
						name: session.user.name as string,
						image: session.user.image as string,
						gender: data.gender,
						dateOfBirth: new Date(data.dateOfBirth),
						description: data.description,
						country: data.country,
						city: data.city,
					},
				},
			},
			select: {
				accounts: {
					select: {
						provider: true,
					},
				},
			},
		})

		return { status: 'success', data: user.accounts[0].provider }
	} catch (error) {
		console.error(error)
		throw error
	}
}
