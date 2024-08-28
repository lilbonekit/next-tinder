/* eslint-disable no-console */
'use server'

import { Member, Photo } from '@prisma/client'
import { addYears } from 'date-fns'
import { GetMemberParams, PaginatedResponse } from 'types'
import { GENDERS, ORDER_BY_LIST } from 'types/enums'

import { prisma } from '@/lib/prisma'

import { getAuthUserId } from './authActions'

export async function getMembers({
	ageRange = '18,100',
	gender = `${GENDERS.male},${GENDERS.female}`,
	orderBy = ORDER_BY_LIST.updated,
	pageNumber = '1',
	pageSize = '12',
	withPhotoOnly = 'false',
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
	const userId = await getAuthUserId()

	const [minAge, maxAge] = ageRange.split(',')
	const currentDate = new Date()
	const minDob = addYears(currentDate, -maxAge - 1)
	const maxDob = addYears(currentDate, -minAge)
	const selectedGender = gender.split(',')

	const page = parseInt(pageNumber)
	const limit = parseInt(pageSize)
	const imageCondition =
		withPhotoOnly === 'true' ? { image: { not: null } } : {}

	const skip = (page - 1) * limit

	try {
		const count = await prisma.member.count({
			where: {
				...imageCondition,
				AND: [
					{ dateOfBirth: { gte: minDob } },
					{ dateOfBirth: { lte: maxDob } },
					{ gender: { in: selectedGender } },
				],
				NOT: { userId },
			},
		})

		const members = await prisma.member.findMany({
			where: {
				...imageCondition,
				AND: [
					{ dateOfBirth: { gte: minDob } },
					{ dateOfBirth: { lte: maxDob } },
					{ gender: { in: selectedGender } },
				],
				NOT: { userId },
			},
			orderBy: { [orderBy]: 'desc' },
			skip,
			take: limit,
		})

		return {
			items: members,
			totalCount: count,
		}
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

export async function getMemberPhotoByPublicId(publicId: string) {
	try {
		const photo = await prisma.photo.findUnique({
			where: { publicId },
		})
		if (!photo) throw new Error('no-photo')
		return photo
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function updateLastActive() {
	const userId = await getAuthUserId()

	try {
		return prisma.member.update({
			where: { userId },
			data: { updated: new Date() },
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
