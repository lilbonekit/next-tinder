import { deleteMessage } from 'app/actions/messageAction'
import { useRouter } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Key } from 'readline'
import { MessageDto } from 'types'
import { MESSAGE_SIDEBAR_KEYS, MESSAGE_TABLE_KEYS } from 'types/enums'

import useMessageStore from './useMessageStore'

export const useMessages = (initialMessages: MessageDto[]) => {
	const { set, remove, messages, updateUnreadCount } = useMessageStore(
		(state) => ({
			messages: state.messages,
			set: state.set,
			remove: state.remove,
			updateUnreadCount: state.updateUnreadCount,
		})
	)
	const [isDeleting, setIsDeleting] = useState({ id: '', loading: false })
	const t = useTranslations('message-table')
	const router = useRouter()
	const searchParams = useSearchParams()
	const isOutbox = searchParams.get('container') === MESSAGE_SIDEBAR_KEYS.outbox

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

		return () => {
			set([])
		}
	}, [initialMessages, set])

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
	}
}
