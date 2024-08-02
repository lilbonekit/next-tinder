import { differenceInYears, format } from 'date-fns'
import { FieldError, FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ZodIssue } from 'zod'

export const calculateAge = (dateOfBirth: Date) =>
	differenceInYears(new Date(), dateOfBirth)

export const formatShortDateTime = (date: Date) =>
	format(date, 'dd.MM.yyyy h:mm:a')

export const getErrorMessage = (fieldError?: FieldError) => {
	if (!fieldError) return 'invalid-field'
	const errorMessageKey = fieldError.message
	return errorMessageKey
}

export const handleFormServerErrors = <TFieldValues extends FieldValues>(
	errorResponse: { error: string | ZodIssue[] },
	setError: UseFormSetError<TFieldValues>
) => {
	if (Array.isArray(errorResponse.error)) {
		errorResponse.error.forEach((error) => {
			const fieldName = error.path.join('.') as Path<TFieldValues>
			setError(fieldName, { message: error.message })
		})
		return
	}
	setError('root.serverError', { message: errorResponse.error })
}

export const transformImageUrl = (imageUrl?: string | null) => {
	if (!imageUrl) return
	if (!imageUrl.includes('cloudinary')) return imageUrl

	const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length

	return `${imageUrl.slice(0, uploadIndex)}${
		process.env.NEXT_PUBLIC_IMAGE_TRANSFORMATION
	}${imageUrl.slice(uploadIndex)}`
}

export function truncateString(text?: string | null, length = 50) {
	if (!text) return null
	if (text.length <= length) {
		return text
	}
	return text.slice(0, length) + '...'
}
