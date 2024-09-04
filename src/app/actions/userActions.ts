/* eslint-disable no-console */
'use server'

import { Member, Photo } from '@prisma/client'
import { ActionResult } from 'types'

import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import {
	MemberEditSchema,
	memberEditSchema,
} from '@/lib/schemas/memberEditSchema'

import { getAuthUserId } from './authActions'

export async function updateMemberProfile(
	data: MemberEditSchema,
	nameUpdated?: boolean
): Promise<ActionResult<Member>> {
	try {
		const userId = await getAuthUserId()
		const validated = memberEditSchema.safeParse(data)

		if (!validated.success) {
			return { status: 'error', error: 'invalid-data' }
		}

		const { name, description, city, country } = validated.data

		if (nameUpdated) {
			await prisma.user.update({
				where: { id: userId },
				data: { name },
			})
		}

		const member = await prisma.member.update({
			where: { userId },
			data: {
				name,
				description,
				city,
				country,
			},
		})
		return { status: 'success', data: member }
	} catch (error) {
		console.error(error)
		return { status: 'error', error: 'something-wrong' }
	}
}

export async function addImage(url: string, publicId: string) {
	try {
		const userId = await getAuthUserId()
		return prisma.member.update({
			where: { userId },
			data: {
				photos: {
					create: [
						{
							url,
							publicId,
						},
					],
				},
			},
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function deleteImage(photo: Photo) {
	try {
		const userId = await getAuthUserId()
		if (photo.publicId) {
			await cloudinary.v2.uploader.destroy(photo.publicId)
		}

		return prisma.member.update({
			where: { userId },
			data: {
				photos: {
					delete: { id: photo.id },
				},
			},
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function setMainImage(photo: Photo) {
	if (!photo.isApproved) throw new Error('Only approved photos')
	try {
		const userId = await getAuthUserId()
		await prisma.user.update({
			where: { id: userId },
			data: { image: photo.url },
		})

		return prisma.member.update({
			where: { userId },
			data: { image: photo.url },
		})
	} catch (error) {
		console.error(error)
	}
}

export async function getUserInfoForNav() {
	try {
		const userId = await getAuthUserId()
		return prisma.user.findUnique({
			where: { id: userId },
			select: { name: true, image: true, email: true },
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
