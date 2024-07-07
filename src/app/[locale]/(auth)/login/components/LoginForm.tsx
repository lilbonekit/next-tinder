'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { FieldError, useForm } from 'react-hook-form'

import { formLoginSchema, LoginSchema } from '@/lib/schemas/loginSchema'

const LoginForm = () => {
	const t = useTranslations('login-form')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(formLoginSchema),
		mode: 'onTouched',
	})

	const onSubmit = (data: LoginSchema) => {
		console.log(data)
	}

	const getErrorMessage = (fieldError?: FieldError) => {
		if (!fieldError) return t('invalid-field')
		const errorMessageKey = fieldError.message
		return t(errorMessageKey)
	}

	return (
		<>
			<Card className='lg:w-2/5 mx-auto w-full p-2'>
				<CardHeader className='flex flex-col items-center justify-center'>
					<div className='flex flex-col gap-2 items-center'>
						<div className='flex flex-row items-center gap-3 text-pink-950'>
							<h1 className='text-3xl font-light'>{t('title')}</h1>
						</div>
						<p className='text-neutral-500'>{t('description')}</p>
					</div>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='space-y-2'>
							<Input
								{...register('email')}
								size='md'
								defaultValue=''
								label={t('email-lbl')}
								variant='bordered'
								isInvalid={!!errors.email}
								autoComplete='user-name'
								errorMessage={getErrorMessage(errors.email)}
							/>
							<Input
								{...register('password')}
								size='md'
								defaultValue=''
								label={t('password-lbl')}
								variant='bordered'
								type='password'
								isInvalid={!!errors.password}
								autoComplete='current-password'
								errorMessage={getErrorMessage(errors.password)}
							/>
							<Button
								fullWidth
								className='main-gradient'
								size='lg'
								type='submit'
							>
								<span className='text-light-gradient'>{t('submit-lbl')}</span>
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</>
	)
}
export default LoginForm
