import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['en', 'ua']

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as 'en' | 'ua')) notFound()

	return {
		messages: (await import(`../locale/${locale}.json`)).default,
	}
})
