'use client'

import { ScrollShadow } from '@nextui-org/react'
import useMessageStore from 'hooks/useMessageStore'
import { Channel } from 'pusher-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageDto } from 'types'
import { MESSAGE_PUSHER_EVENTS } from 'types/enums'

import { pusherClient } from '@/lib/pusher'
import { formatShortDateTime } from '@/lib/util'

import { MessageBox } from './MessageBox'

interface MessageListProps {
	initialMessages: { messages: MessageDto[]; readCount: number }
	currentUserId: string
	chatId: string
	noMessage: string
}

export const MessageList = ({
	initialMessages,
	currentUserId,
	chatId,
	noMessage,
}: MessageListProps) => {
	const [messages, setMessages] = useState(initialMessages.messages)
	const channelRef = useRef<Channel | null>(null)
	const setReadCount = useRef<boolean>(false)

	const { updateUnreadCount } = useMessageStore((state) => ({
		updateUnreadCount: state.updateUnreadCount,
	}))

	useEffect(() => {
		if (!setReadCount.current) {
			updateUnreadCount(-initialMessages.readCount)
			setReadCount.current = true
		}
	}, [initialMessages.readCount, updateUnreadCount])

	const handleNewMessage = useCallback((message: MessageDto) => {
		setMessages((prevState) => [...prevState, message])
	}, [])

	const handleReadMessages = useCallback((messageIds: string[]) => {
		setMessages((prevState) =>
			prevState.map((message) =>
				messageIds.includes(message.id)
					? { ...message, dateRead: formatShortDateTime(new Date()) }
					: message
			)
		)
	}, [])

	useEffect(() => {
		if (!channelRef.current) {
			channelRef.current = pusherClient.subscribe(chatId)

			channelRef.current.bind(
				MESSAGE_PUSHER_EVENTS.messageNew,
				handleNewMessage
			)
			channelRef.current.bind(
				MESSAGE_PUSHER_EVENTS.messagesRead,
				handleReadMessages
			)
		}

		return () => {
			if (channelRef.current && channelRef.current.subscribed) {
				channelRef.current.unsubscribe()
				channelRef.current.unbind(
					MESSAGE_PUSHER_EVENTS.messageNew,
					handleNewMessage
				)
				channelRef.current.unbind(
					MESSAGE_PUSHER_EVENTS.messagesRead,
					handleReadMessages
				)
			}
		}
	}, [chatId, handleNewMessage, handleReadMessages])

	return (
		<>
			{messages.length ? (
				<ScrollShadow size={25}>
					<div>
						{messages.map((message) => (
							<MessageBox
								key={message.id}
								message={message}
								currentUserId={currentUserId}
							/>
						))}
					</div>
				</ScrollShadow>
			) : (
				<div className='flex justify-center items-center w-full h-full'>
					<span className='text-neutral-500 font-light text-center'>
						{noMessage}
					</span>
				</div>
			)}
		</>
	)
}
