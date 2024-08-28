/* eslint-disable no-console */
'use server'

import { ActionResult, MessageDto } from 'types'
import {
	MESSAGE_DELETE_KEYS,
	MESSAGE_PUSHER_EVENTS,
	MESSAGE_QUERY,
	MESSAGE_SIDEBAR_KEYS,
} from 'types/enums'

import { mapMessageToMessageDto } from '@/lib/mapping'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { MessageSchema, messageSchema } from '@/lib/schemas/messageSchema'
import { createChatId } from '@/lib/util'

import { getAuthUserId } from './authActions'

export async function createMessage(
	recipientId: string,
	data: MessageSchema
): Promise<ActionResult<MessageDto>> {
	try {
		const userId = await getAuthUserId()
		const validated = messageSchema.safeParse(data)

		if (!validated.success)
			return { status: 'error', error: validated.error.errors }

		const { text } = validated.data
		const message = await prisma.message.create({
			data: {
				text,
				recipientId,
				senderId: userId,
			},
			select: messageSelect,
		})

		const messageDto = mapMessageToMessageDto(message)
		await pusherServer.trigger(
			createChatId(recipientId, userId),
			MESSAGE_PUSHER_EVENTS.messageNew,
			messageDto
		)
		await pusherServer.trigger(
			`private-${recipientId}`,
			MESSAGE_PUSHER_EVENTS.messageNew,
			messageDto
		)
		return { status: 'success', data: messageDto }
	} catch (error) {
		console.error(error)
		return { status: 'error', error: 'something-wrong' }
	}
}

export async function getMessageThread(recipientId: string) {
	try {
		const userId = await getAuthUserId()
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						senderId: userId,
						recipientId,
						senderDeleted: false,
					},
					{
						senderId: recipientId,
						recipientId: userId,
						recipientDeleted: false,
					},
				],
			},
			orderBy: {
				created: 'asc',
			},
			select: messageSelect,
		})

		// eslint-disable-next-line prefer-const
		let readCount = 0

		if (messages.length) {
			const readMessageIds = messages
				.filter(
					(message) =>
						!message.dateRead &&
						message.recipient?.userId === userId &&
						message.sender?.userId === recipientId
				)
				.map((message) => message.id)

			await prisma.message.updateMany({
				where: { id: { in: readMessageIds } },
				data: { dateRead: new Date() },
			})

			readCount = readMessageIds.length

			await pusherServer.trigger(
				createChatId(userId, recipientId),
				MESSAGE_PUSHER_EVENTS.messagesRead,
				readMessageIds
			)
		}

		const messagesToReturn = messages.map(mapMessageToMessageDto)

		return { messages: messagesToReturn, readCount }
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getMessagesByContainer(
	container?: MESSAGE_SIDEBAR_KEYS,
	cursor?: string,
	limit = 10
) {
	try {
		const userId = await getAuthUserId()

		const conditions = {
			[container === MESSAGE_SIDEBAR_KEYS.outbox
				? MESSAGE_QUERY.senderId
				: MESSAGE_QUERY.recipientId]: userId,
			...(container === MESSAGE_SIDEBAR_KEYS.outbox
				? { senderDeleted: false }
				: { recipientDeleted: false }),
		}

		const messages = await prisma.message.findMany({
			where: {
				...conditions,
				...(cursor ? { created: { lte: new Date(cursor) } } : {}),
			},
			orderBy: {
				created: 'desc',
			},
			select: messageSelect,
			take: limit + 1,
		})

		let nextCursor: string | undefined

		if (messages.length > limit) {
			const nextItem = messages.pop()
			nextCursor = nextItem?.created.toISOString()
		} else {
			nextCursor = undefined
		}

		const messagesToReturn = messages.map((message) =>
			mapMessageToMessageDto(message)
		)
		return {
			messages: messagesToReturn,
			nextCursor,
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
	const selector = isOutbox
		? MESSAGE_DELETE_KEYS.senderDeleted
		: MESSAGE_DELETE_KEYS.recipientDeleted

	try {
		const userId = await getAuthUserId()
		await prisma.message.update({
			where: { id: messageId },
			data: {
				[selector]: true,
			},
		})

		const messagesToDelete = await prisma.message.findMany({
			where: {
				OR: [
					{
						senderId: userId,
						senderDeleted: true,
						recipientDeleted: true,
					},
					{
						recipientId: userId,
						senderDeleted: true,
						recipientDeleted: true,
					},
				],
			},
		})

		if (messagesToDelete.length) {
			await prisma.message.deleteMany({
				where: {
					OR: messagesToDelete.map((message) => ({ id: message.id })),
				},
			})
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getUnreadMessageCount() {
	try {
		const userId = await getAuthUserId()

		return prisma.message.count({
			where: {
				recipientId: userId,
				dateRead: null,
				recipientDeleted: false,
			},
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

const messageSelect = {
	id: true,
	text: true,
	created: true,
	dateRead: true,
	sender: {
		select: {
			userId: true,
			name: true,
			image: true,
		},
	},
	recipient: {
		select: {
			userId: true,
			name: true,
			image: true,
		},
	},
}
