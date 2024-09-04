/* eslint-disable no-console */
'use server'

import { Photo } from '@prisma/client'

import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

import { getUserRole } from './authActions'

export async function getUnapprovedPhotos() {
	try {
		const role = await getUserRole()

		if (role !== 'ADMIN') throw new Error('forbidden')

		return prisma.photo.findMany({
			where: {
				isApproved: false,
			},
		})
	} catch (error) {
		console.error(error)
		return []
	}
}

export async function approvePhoto(photoId: string) {
	try {
		const role = await getUserRole()

		if (role !== 'ADMIN') {
			throw new Error('forbidden')
		}

		const photo = await prisma.photo.findUnique({
			where: { id: photoId },
			include: { member: { include: { user: true } } },
		})

		if (!photo || !photo?.member || !photo.member.user) {
			throw new Error('cannot-approve')
		}

		const { member } = photo

		const userUpdate =
			member.user && member.user.image !== null ? { image: photo.url } : {}
		const memberUpdate = member.image === null ? { image: photo.url } : {}

		if (Object.keys(userUpdate).length) {
			await prisma.user.update({
				where: { id: member.userId },
				data: userUpdate,
			})
		}

		return prisma.member.update({
			where: { id: member.id },
			data: {
				...memberUpdate,
				photos: {
					update: {
						where: { id: photo.id },
						data: { isApproved: true },
					},
				},
			},
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function rejectPhoto(photo: Photo) {
	try {
		const role = await getUserRole()

		if (role !== 'ADMIN') throw new Error('forbidden')

		if (photo.publicId) {
			await cloudinary.v2.uploader.destroy(photo.publicId)
		}

		return prisma.photo.delete({
			where: { id: photo.id },
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
