'use server'

import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import {
	formRegisterSchema,
	RegisterSchema,
} from '@/lib/schemas/registerSchema'

export async function registerUser(data: RegisterSchema) {
	const validated = formRegisterSchema.safeParse(data)

	if (!validated.success) {
		return { error: validated.error.errors }
	}

	const { name, email, password } = validated.data
	const passwordHash = await bcrypt.hash(password, 10)

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})

	if (existingUser) return { error: 'User already exists' }

	return prisma.user.create({
		data: {
			name,
			email,
			passwordHash,
		},
	})
}
