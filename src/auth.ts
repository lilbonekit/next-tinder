import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { prisma } from '@/lib/prisma'

import authConfig from './auth.config'

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		async jwt({ user, token }) {
			if (user) {
				token.profileComplete = user.profileComplete
			}
			return token
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
				session.user.profileComplete = token.profileComplete as boolean
			}
			return session
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	...authConfig,
})
