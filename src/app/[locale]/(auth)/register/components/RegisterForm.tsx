'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { registerUser } from 'app/actions/authActions'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { LoadingComponent } from '@/components/LoadingComponent'
import {
	formRegisterSchema,
	RegisterSchema,
} from '@/lib/schemas/registerSchema'
import { getErrorMessage, handleFormServerErrors } from '@/lib/util'

const RegisterForm = () => {
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('register-form')
	const router = useRouter()

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegisterSchema>({
		resolver: zodResolver(formRegisterSchema),
		mode: 'onTouched',
	})

	const onSubmit = async (data: RegisterSchema) => {
		const result = await registerUser(data)

		switch (result.status) {
			case 'success':
				startTransition(() => {
					toast.success(t('user-registered'))
					router.push('/login')
				})
				break
			default:
				handleFormServerErrors(result, setError)
				break
		}
	}

	return (
		<>
			{isPending ? (
				<LoadingComponent />
			) : (
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
									{...register('name')}
									size='md'
									defaultValue=''
									label={t('name-lbl')}
									variant='bordered'
									isInvalid={!!errors.name}
									autoComplete='user-name'
									errorMessage={t(getErrorMessage(errors.name))}
								/>
								<Input
									{...register('email')}
									size='md'
									defaultValue=''
									label={t('email-lbl')}
									variant='bordered'
									isInvalid={!!errors.email}
									autoComplete='user-name'
									errorMessage={t(getErrorMessage(errors.email))}
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
									errorMessage={t(getErrorMessage(errors.password))}
								/>
								{errors.root?.serverError && (
									<p className='text-danger text-sm'>
										{t(errors.root.serverError.message)}
									</p>
								)}
								<Button
									fullWidth
									isLoading={isSubmitting}
									className='main-gradient'
									size='lg'
									type='submit'
									color='primary'
								>
									<span className='text-light-gradient'>{t('submit-lbl')}</span>
								</Button>
							</div>
						</form>
					</CardBody>
				</Card>
			)}
		</>
	)
}

export default RegisterForm
