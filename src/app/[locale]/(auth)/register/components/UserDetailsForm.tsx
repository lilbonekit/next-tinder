'use client'

import { Input } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { FieldError, useFormContext } from 'react-hook-form'

import { getErrorMessage } from '@/lib/util'

export const UserDetailsForm = () => {
	const {
		register,
		formState: { errors },
		getValues,
	} = useFormContext()
	const t = useTranslations('register-form')

	return (
		<div className='space-y-2'>
			<Input
				{...register('name')}
				size='md'
				defaultValue={getValues('name')}
				label={t('name-lbl')}
				variant='bordered'
				isInvalid={!!errors.name}
				autoComplete='user-name'
				errorMessage={t(getErrorMessage(errors.name as FieldError))}
			/>
			<Input
				{...register('email')}
				size='md'
				defaultValue={getValues('email')}
				label={t('email-lbl')}
				variant='bordered'
				isInvalid={!!errors.email}
				autoComplete='user-email'
				errorMessage={t(getErrorMessage(errors.email as FieldError))}
			/>
			<Input
				{...register('password')}
				size='md'
				defaultValue={getValues('password')}
				label={t('password-lbl')}
				variant='bordered'
				type='password'
				isInvalid={!!errors.password}
				autoComplete='current-password'
				errorMessage={t(getErrorMessage(errors.password as FieldError))}
			/>
		</div>
	)
}
