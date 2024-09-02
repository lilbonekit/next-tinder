import { z as zod } from 'zod'

import { calculateAge } from '../util'

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

export const profileSchema = zod.object({
	gender: zod
		.string({ message: 'gender-required' })
		.min(1, { message: 'select-gender' }),
	description: zod
		.string({ message: 'description-required' })
		.min(5, { message: 'description-length' }),
	country: zod
		.string({ message: 'country-required' })
		.min(1, { message: 'country-length' }),
	city: zod
		.string({ message: 'city-required' })
		.min(1, { message: 'city-length' }),
	dateOfBirth: zod
		.string({ message: 'date-required' })
		.min(1, { message: 'date-length' })
		.refine(
			(dateString) => {
				const age = calculateAge(new Date(dateString))
				return age >= 18
			},
			{
				message: 'at-least-18',
			}
		),
})

export const combinedRegisterSchema = formRegisterSchema.and(profileSchema)
export type ProfileSchema = zod.infer<typeof profileSchema>
export type RegisterSchema = zod.infer<
	typeof formRegisterSchema & typeof profileSchema
>
