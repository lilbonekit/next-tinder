import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { membersData } from './membersData'

const prisma = new PrismaClient()

async function seedMembers() {
	return membersData.map(async (member) =>
		prisma.user.create({
			data: {
				name: member.name,
				email: member.email,
				emailVerified: new Date(),
				passwordHash: await hash('12312', 10),
				image: member.image,
				profileComplete: true,
				member: {
					create: {
						dateOfBirth: new Date(member.dateOfBirth),
						gender: member.gender,
						name: member.name,
						created: new Date(member.created),
						updated: new Date(member.lastActive),
						description: member.description,
						city: member.city,
						country: member.country,
						image: member.image,
						photos: {
							create: {
								url: member.image,
							},
						},
					},
				},
			},
		})
	)
}

async function main() {
	await seedMembers()
}

main()
	.catch((error) => {
		// eslint-disable-next-line no-console
		console.error(error)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect())
