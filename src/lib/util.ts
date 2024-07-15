import { differenceInYears } from 'date-fns'

export function calculateAge(dateOfBirth: Date) {
	return differenceInYears(new Date(), dateOfBirth)
}
