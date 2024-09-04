import { PrismaAdapter } from '@auth/prisma-adapter'
import { Role } from '@prisma/client'
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
				token.role = user.role
			}
			return token
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
				session.user.profileComplete = token.profileComplete as boolean
				session.user.role = token.role as Role
			}
			return session
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	...authConfig,
})
