import { z as zod } from 'zod'

export const memberEditSchema = zod.object({
	name: zod
		.string({ message: 'name-required' })
		.min(3, { message: 'name-length' }),
	description: zod
		.string({ message: 'description-required' })
		.min(1, { message: 'description-required' }),
	city: zod
		.string({ message: 'city-required' })
		.min(1, { message: 'city-required' }),
	country: zod
		.string({ message: 'country-required' })
		.min(1, { message: 'country-required' }),
})

export type MemberEditSchema = zod.infer<typeof memberEditSchema>
