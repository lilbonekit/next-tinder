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

	const isProviderRoutes = pathnameWithoutLocale.includes('api')
	const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale)
	const isAuthRoute = authRoutes.includes(pathnameWithoutLocale)
	const isProfileComplete = request.auth?.user.profileComplete
	const isAdmin = request.auth?.user.role === 'ADMIN'
	const isAdminRoute = pathnameWithoutLocale.startsWith('/admin')

	if (isPublicRoute && !isProviderRoutes) {
		intlMiddleware(request)
		return NextResponse.redirect(new URL('/login', nextUrl))
	}

	if (isAdminRoute && !isAdmin) {
		return NextResponse.redirect(new URL('/', nextUrl))
	}

	if (isAuthRoute && !isProviderRoutes) {
		return isLoggedIn
			? NextResponse.redirect(new URL('/members', nextUrl))
			: intlMiddleware(request)
	}

	if (!isPublicRoute && !isLoggedIn && !isProviderRoutes) {
		intlMiddleware(request)
		return NextResponse.redirect(new URL('/login', nextUrl))
	}

	if (
		isLoggedIn &&
		!isProfileComplete &&
		pathnameWithoutLocale !== '/complete-profile' &&
		!isAdmin
	) {
		return NextResponse.redirect(new URL('/complete-profile', nextUrl))
	}

	if (!isProviderRoutes) {
		return intlMiddleware(request)
	}
})

export default authMiddleware
