import { getMemberByUserId } from 'app/actions/membersActions'
import { usePathname } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { Channel } from 'pusher-js'
import { useCallback, useEffect, useRef } from 'react'
import { MessageDto } from 'types'
import {
	LIKE_PUSHER_EVENTS,
	MESSAGE_PUSHER_EVENTS,
	MESSAGE_SIDEBAR_KEYS,
	TOAST_TYPES,
} from 'types/enums'

import { customToast } from '@/components/NewMessageToast'
import { pusherClient } from '@/lib/pusher'

import useMessageStore from './useMessageStore'

export const useNotificationChannel = (userId?: string | null) => {
	const channelRef = useRef<Channel | null>(null)
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { add, updateUnreadCount } = useMessageStore((state) => ({
		add: state.add,
		updateUnreadCount: state.updateUnreadCount,
	}))

	const handleNewMessage = useCallback(
		(message: MessageDto) => {
			if (
				pathname === '/messages' &&
				searchParams.get('container') !== MESSAGE_SIDEBAR_KEYS.outbox
			) {
				add(message)
				updateUnreadCount(1)
				return
			}

			if (pathname !== `/members/${message.senderId}/chat`) {
				customToast({ message, type: TOAST_TYPES.newMessage })
				updateUnreadCount(1)
			}
		},
		[pathname, searchParams, add, updateUnreadCount]
	)

	const handleNewLike = useCallback(async (sourceId: string) => {
		try {
			const member = await getMemberByUserId(sourceId)
			if (member) {
				customToast({ member, type: TOAST_TYPES.like })
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error fetching member:', error)
			throw error
		}
	}, [])

	useEffect(() => {
		if (!userId) return
		if (!channelRef.current) {
			channelRef.current = pusherClient.subscribe(`private-${userId}`)
			channelRef.current.bind(
				MESSAGE_PUSHER_EVENTS.messageNew,
				handleNewMessage
			)

			channelRef.current.bind(LIKE_PUSHER_EVENTS.likeNew, handleNewLike)
		}

		return () => {
			if (channelRef.current && channelRef.current.subscribed) {
				channelRef.current.unsubscribe()
				channelRef.current.unbind(
					MESSAGE_PUSHER_EVENTS.messageNew,
					handleNewMessage
				)
				channelRef.current.unbind(LIKE_PUSHER_EVENTS.likeNew, handleNewLike)
				channelRef.current = null
			}
		}
	}, [userId, handleNewMessage, handleNewLike])
}
