'use client'

import { Button, Input } from '@nextui-org/react'
import { generateResetPasswordEmail } from 'app/actions/authActions'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ActionResult } from 'types'

import { CardWrapper } from '@/components/CardWrapper'
import { ResultMessage } from '@/components/ResultMessage'

export const ForgotPasswordForm = () => {
	const t = useTranslations('forgot-password')
	const locale = useLocale()
	const [result, setResult] = useState<ActionResult<string> | null>(null)
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid },
	} = useForm()

	const onSubmit = async (data: FieldValues) => {
		const result = await generateResetPasswordEmail(data.email, locale)
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
						className='flex flex-col space-y-4'
						onSubmit={handleSubmit(onSubmit)}
					>
						<Input
							{...register('email', { required: true })}
							size='md'
							defaultValue=''
							label={t('email-lbl')}
							variant='bordered'
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
