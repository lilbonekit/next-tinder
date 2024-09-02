'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { resetPassword } from 'app/actions/authActions'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { ActionResult } from 'types'

import { CardWrapper } from '@/components/CardWrapper'
import { ResultMessage } from '@/components/ResultMessage'
import {
	ResetPasswordSchema,
	resetPasswordSchema,
} from '@/lib/schemas/resetPasswordSchema'
import { getErrorMessage } from '@/lib/util'

export const ResetPasswordForm = () => {
	const searchParams = useSearchParams()
	const t = useTranslations('reset-password')
	const [result, setResult] = useState<ActionResult<string> | null>(null)
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ResetPasswordSchema>({
		mode: 'onTouched',
		resolver: zodResolver(resetPasswordSchema),
	})

	const onSubmit = async (data: ResetPasswordSchema) => {
		const result = await resetPassword(data.password, searchParams.get('token'))
		setResult(result)
		reset()
	}

	return (
		<CardWrapper
			title={t('title')}
			description={t('description')}
			body={
				<>
					<form
						className='flex flex-col space-y-2'
						onSubmit={handleSubmit(onSubmit)}
					>
						<Input
							{...register('password')}
							type='password'
							size='md'
							defaultValue=''
							label={t('password-lbl')}
							variant='bordered'
							isInvalid={!!errors.password}
							errorMessage={t(getErrorMessage(errors.password as FieldError))}
						/>
						<Input
							{...register('confirmPassword')}
							type='password'
							size='md'
							defaultValue=''
							label={t('confirm-password-lbl')}
							variant='bordered'
							isInvalid={!!errors.confirmPassword}
							errorMessage={t(
								getErrorMessage(errors.confirmPassword as FieldError)
							)}
						/>
						<Button
							fullWidth
							isLoading={isSubmitting}
							className='main-gradient'
							size='lg'
							type='submit'
							color='primary'
							isDisabled={!isValid}
						>
							<span className='text-light-gradient'>{t('submit-lbl')}</span>
						</Button>
						<ResultMessage result={result} />
					</form>
				</>
			}
		/>
	)
}
