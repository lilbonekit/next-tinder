/* eslint-disable no-console */
'use server'

import { getAuthUserId } from 'app/actions/authActions'

import { prisma } from '@/lib/prisma'

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
	try {
		const userId = await getAuthUserId()

		isLiked
			? await prisma.like.delete({
					where: {
						sourceUserId_targetUserId: {
							sourceUserId: userId,
							targetUserId,
						},
					},
			  })
			: await prisma.like.create({
					data: {
						sourceUserId: userId,
						targetUserId,
					},
			  })
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function fetchCurrentUserLikeIds() {
	try {
		const userId = await getAuthUserId()
		const likeIds = await prisma.like.findMany({
			where: {
				sourceUserId: userId,
			},
			select: {
				targetUserId: true,
			},
		})

		return likeIds.map((like) => like.targetUserId)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function fetchLikedMembers(type = 'source') {
	try {
		const userId = await getAuthUserId()

		switch (type) {
			case 'source':
				return await fetchSourceLikes(userId)
			case 'target':
				return await fetchTargetLikes(userId)
			case 'mutual':
				return await fetchMutualLikes(userId)
			default:
				return []
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function fetchSourceLikes(userId: string) {
	const sourceList = await prisma.like.findMany({
		where: {
			sourceUserId: userId,
		},
		select: { targetMember: true },
	})
	return sourceList.map((member) => member.targetMember)
}

async function fetchTargetLikes(userId: string) {
	const targetList = await prisma.like.findMany({
		where: {
			targetUserId: userId,
		},
		select: { sourceMember: true },
	})
	return targetList.map((member) => member.sourceMember)
}

async function fetchMutualLikes(userId: string) {
	const likedUsers = await prisma.like.findMany({
		where: {
			sourceUserId: userId,
		},
		select: { targetUserId: true },
	})

	const likedIds = likedUsers.map((member) => member.targetUserId)
	const mutualList = await prisma.like.findMany({
		where: {
			AND: [{ targetUserId: userId }, { sourceUserId: { in: likedIds } }],
		},
		select: { sourceMember: true },
	})

	return mutualList.map((member) => member.sourceMember)
}
