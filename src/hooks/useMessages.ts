import {
	deleteMessage,
	getMessagesByContainer,
} from 'app/actions/messageAction'
import { useRouter } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Key } from 'readline'
import { MessageDto } from 'types'
import { MESSAGE_SIDEBAR_KEYS, MESSAGE_TABLE_KEYS } from 'types/enums'

import useMessageStore from './useMessageStore'

export const useMessages = (
	initialMessages: MessageDto[],
	nextCursor?: string
) => {
	const cursorRef = useRef(nextCursor)
	const { set, remove, messages, updateUnreadCount, resetMessages } =
		useMessageStore((state) => ({
			messages: state.messages,
			set: state.set,
			remove: state.remove,
			updateUnreadCount: state.updateUnreadCount,
			resetMessages: state.resetMessages,
		}))
	const [isDeleting, setIsDeleting] = useState({ id: '', loading: false })
	const [loadingMore, setLoadingMore] = useState(false)

	const t = useTranslations('message-table')
	const router = useRouter()
	const searchParams = useSearchParams()
	const isOutbox = searchParams.get('container') === MESSAGE_SIDEBAR_KEYS.outbox
	const container = searchParams.get('container') as MESSAGE_SIDEBAR_KEYS

	const loadMore = useCallback(async () => {
		if (cursorRef.current) {
			setLoadingMore(true)
			const { messages, nextCursor } = await getMessagesByContainer(
				container,
				cursorRef.current
			)
			set(messages)
			cursorRef.current = nextCursor
			setLoadingMore(false)
		}
	}, [container, set])

	const columns = [
		{
			key: isOutbox
				? MESSAGE_TABLE_KEYS.recipientName
				: MESSAGE_TABLE_KEYS.senderName,
			label: isOutbox ? t('recipient') : t('sender'),
		},
		{
			key: MESSAGE_TABLE_KEYS.text,
			label: t('message'),
		},
		{
			key: MESSAGE_TABLE_KEYS.created,
			label: isOutbox ? t('date-sent') : t('date-received'),
		},
		{
			key: MESSAGE_TABLE_KEYS.actions,
			label: t('actions'),
		},
	]

	useEffect(() => {
		set(initialMessages)
		cursorRef.current = nextCursor

		return () => {
			resetMessages()
		}
	}, [initialMessages, nextCursor, resetMessages, set])

	const handleDeleteMessage = useCallback(
		async (message: MessageDto) => {
			setIsDeleting({ id: message.id, loading: true })
			await deleteMessage(message.id, isOutbox)
			remove(message.id)
			if (!message.dateRead && !isOutbox) updateUnreadCount(-1)
			setIsDeleting({ id: '', loading: false })
		},
		[isOutbox, remove, updateUnreadCount]
	)

	const handleRowSelect = (key: Key) => {
		const message = messages.find((message) => message.id === key)
		const url = isOutbox
			? `/members/${message?.recipientId}`
			: `/members/${message?.senderId}`

		router.push(url + '/chat')
	}

	return {
		isOutbox,
		columns,
		deleteMessage: handleDeleteMessage,
		selectRow: handleRowSelect,
		isDeleting,
		messages,
		loadMore,
		loadingMore,
		hasMore: Boolean(cursorRef.current),
	}
}
