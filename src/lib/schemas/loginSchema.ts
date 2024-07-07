import { z as zod } from 'zod'

export const formLoginSchema = zod.object({
	email: zod
		.string({ message: 'email-required' })
		.email({ message: 'email-invalid' }),
	password: zod
		.string({ message: 'password-required' })
		.min(5, { message: 'password-length' }),
})

export type LoginSchema = zod.infer<typeof formLoginSchema>
