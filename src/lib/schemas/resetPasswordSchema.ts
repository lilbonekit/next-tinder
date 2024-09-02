import { z as zod } from 'zod'

export const resetPasswordSchema = zod
	.object({
		password: zod
			.string({ message: 'password-required' })
			.min(5, { message: 'password-length' }),
		confirmPassword: zod
			.string({ message: 'password-required' })
			.min(5, { message: 'password-length' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'password-do-not-match',
		path: ['confirmPassword'],
	})

export type ResetPasswordSchema = zod.infer<typeof resetPasswordSchema>
