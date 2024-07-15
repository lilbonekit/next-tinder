/* eslint-disable no-console */
'use server'

import { Photo } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getMembers() {
	const session = await auth()

	if (!session?.user) {
		return null
	}

	try {
		return prisma.member.findMany({
			where: {
				NOT: {
					userId: session.user.id,
				},
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('failed-to-load-users')
	}
}

export async function getMemberByUserId(userId: string) {
	try {
		return prisma.member.findUnique({
			where: {
				userId,
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('failed-to-load-user')
	}
}

export async function getMemberPhotosByUserId(userId: string) {
	try {
		const member = await prisma.member.findUnique({
			where: { userId },
			select: { photos: true },
		})

		if (!member) return null
		return member.photos.map((photo) => photo) as Photo[]
	} catch (error) {
		console.error(error)
		throw new Error('failed-to-load-photos')
	}
}
