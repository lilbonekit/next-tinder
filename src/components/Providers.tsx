import { NextUIProvider } from '@nextui-org/react'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'
import { getMessages } from 'next-intl/server'

export default async function Providers({ children }: { children: ReactNode }) {
	const messages = await getMessages()
	return (
		<NextIntlClientProvider messages={messages}>
			<NextUIProvider>{children}</NextUIProvider>
		</NextIntlClientProvider>
	)
}
