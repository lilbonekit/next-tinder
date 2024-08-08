'use client'

import 'react-toastify/dist/ReactToastify.css'

import { NextUIProvider } from '@nextui-org/react'
import { getUnreadMessageCount } from 'app/actions/messageAction'
import useMessageStore from 'hooks/useMessageStore'
import { useNotificationChannel } from 'hooks/useNotificationChannel'
import { usePresenceChannel } from 'hooks/usePresenceChannel'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'

interface ProvidersProps {
	children: ReactNode
	userId?: string | null
}

export default function Providers({ children, userId }: ProvidersProps) {
	const isUnreadCountSet = useRef<boolean>(false)
	const { updateUnreadCount } = useMessageStore((state) => ({
		updateUnreadCount: state.updateUnreadCount,
	}))

	const setUnreadCount = useCallback(
		(amount: number) => {
			updateUnreadCount(amount)
		},
		[updateUnreadCount]
	)

	useEffect(() => {
		if (!isUnreadCountSet.current && userId) {
			getUnreadMessageCount().then((count) => {
				setUnreadCount(count)
			})
			isUnreadCountSet.current = true
		}
	}, [setUnreadCount, userId])

	usePresenceChannel()
	useNotificationChannel(userId)

	return (
		<NextUIProvider>
			<ToastContainer position='top-right' className='z-50' hideProgressBar />
			{children}
		</NextUIProvider>
	)
}
