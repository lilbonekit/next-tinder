import { usePathname } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { Channel } from 'pusher-js'
import { useCallback, useEffect, useRef } from 'react'
import { MessageDto } from 'types'
import { MESSAGE_PUSHER_EVENTS, MESSAGE_SIDEBAR_KEYS } from 'types/enums'

import { newMessageToasts } from '@/components/NewMessageToast'
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
				newMessageToasts(message)
				updateUnreadCount(1)
			}
		},
		[pathname, searchParams, add, updateUnreadCount]
	)

	useEffect(() => {
		if (!userId) return
		if (!channelRef.current) {
			channelRef.current = pusherClient.subscribe(`private-${userId}`)
			channelRef.current.bind(
				MESSAGE_PUSHER_EVENTS.messageNew,
				handleNewMessage
			)
		}

		return () => {
			if (channelRef.current && channelRef.current.subscribed) {
				channelRef.current.unsubscribe()
				channelRef.current.unbind(
					MESSAGE_PUSHER_EVENTS.messageNew,
					handleNewMessage
				)
				channelRef.current = null
			}
		}
	}, [userId, handleNewMessage])
}
