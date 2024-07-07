import { z as zod } from 'zod'

export const formRegisterSchema = zod.object({
	name: zod
		.string({ message: 'name-required' })
		.min(3, { message: 'name-length' }),
	email: zod
		.string({ message: 'email-required' })
		.email({ message: 'email-invalid' }),
	password: zod
		.string({ message: 'password-required' })
		.min(5, { message: 'password-length' }),
})

export type RegisterSchema = zod.infer<typeof formRegisterSchema>
