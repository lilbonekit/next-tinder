import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { authRoutes, publicRoutes } from 'routes'

import { auth } from './auth'

const intlMiddleware = createMiddleware({
	// A list of all locales that are supported
	locales: ['en', 'ua'],

	// Used when no locale matches
	defaultLocale: 'en',
})

export const config = {
	// Match only internationalized pathnames
	matcher: [
		'/((?!.+\\.[\\w]+$|_next).*)',
		'/',
		'/(api|trpc)(.*)',
		'/(ua|en)/:path*',
	],
}

const authMiddleware = auth((request) => {
	const { nextUrl } = request
	const isLoggedIn = Boolean(request.auth)
	const pathnameWithoutLocale = nextUrl.pathname.replace(/^\/(en|ua)\//, '/')

	const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale)
	const isAuthRoute = authRoutes.includes(pathnameWithoutLocale)

	if (isPublicRoute) {
		intlMiddleware(request)
		return NextResponse.redirect(new URL('/login', nextUrl))
	}

	if (isAuthRoute) {
		return isLoggedIn
			? NextResponse.redirect(new URL('/members', nextUrl))
			: intlMiddleware(request)
	}

	if (!isPublicRoute && !isLoggedIn) {
		intlMiddleware(request)
		return NextResponse.redirect(new URL('/login', nextUrl))
	}

	return intlMiddleware(request)
})

export default authMiddleware
