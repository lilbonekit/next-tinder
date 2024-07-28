import 'react-toastify/dist/ReactToastify.css'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

export default async function Providers({ children }: { children: ReactNode }) {
	const messages = await getMessages()
	return (
		<NextIntlClientProvider messages={messages}>
			<NextUIProvider>
				<ToastContainer position='top-right' className='z-50' />
				{children}
			</NextUIProvider>
		</NextIntlClientProvider>
	)
}
