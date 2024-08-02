/* eslint-disable no-console */
'use server'

import { Message } from '@prisma/client'
import { ActionResult } from 'types'
import {
	MESSAGE_DELETE_KEYS,
	MESSAGE_QUERY,
	MESSAGE_SIDEBAR_KEYS,
} from 'types/enums'

import { mapMessageToMessageDto } from '@/lib/mapping'
import { prisma } from '@/lib/prisma'
import { MessageSchema, messageSchema } from '@/lib/schemas/messageSchema'

import { getAuthUserId } from './authActions'

export async function createMessage(
	recipientId: string,
	data: MessageSchema
): Promise<ActionResult<Message>> {
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
		})
		return { status: 'success', data: message }
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
			select: {
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
			},
		})

		if (messages.length) {
			await prisma.message.updateMany({
				where: {
					senderId: recipientId,
					recipientId: userId,
					dateRead: null,
				},
				data: { dateRead: new Date() },
			})
		}

		return messages.map(mapMessageToMessageDto)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getMessageByContainer(container: MESSAGE_SIDEBAR_KEYS) {
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
			where: conditions,
			orderBy: {
				created: 'desc',
			},
			select: {
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
			},
		})

		return messages.map((message) => mapMessageToMessageDto(message))
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
