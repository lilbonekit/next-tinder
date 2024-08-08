/* eslint-disable no-console */
import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { pusherServer } from '@/lib/pusher'

export async function POST(request: Request) {
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return new Response('Unathorized', { status: 401 })
		}

		const body = await request.formData()
		const socketId = body.get('socket_id') as string
		const channel = body.get('channel_name') as string
		const data = {
			user_id: session.user.id,
		}

		const authResponse = pusherServer.authorizeChannel(socketId, channel, data)

		return NextResponse.json(authResponse)
	} catch (error) {
		console.error(error)
		throw error
	}
}
