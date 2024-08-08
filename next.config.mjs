import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 0,
		},
	},
}

export default withNextIntl(nextConfig)
