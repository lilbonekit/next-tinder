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
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	...authConfig,
})
