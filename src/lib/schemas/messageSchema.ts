import { z as zod } from 'zod'

export const messageSchema = zod.object({
	text: zod.string().min(1, {
		message: 'content-required',
	}),
})

export type MessageSchema = zod.infer<typeof messageSchema>
