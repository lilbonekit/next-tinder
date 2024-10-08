'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { loginUser } from 'app/actions/authActions'
import { Link, useRouter } from 'navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { LoadingComponent } from '@/components/LoadingComponent'
import { formLoginSchema, LoginSchema } from '@/lib/schemas/loginSchema'
import { getErrorMessage } from '@/lib/util'

import { SocialLogin } from './SocialLogin'

const LoginForm = () => {
	const router = useRouter()
	const t = useTranslations('login-form')
	const locale = useLocale()
	const [isPending, startTransition] = useTransition()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchema>({
		resolver: zodResolver(formLoginSchema),
		mode: 'onTouched',
	})

	const onSubmit = async (data: LoginSchema) => {
		startTransition(async () => {
			const result = await loginUser(data, locale)

			if (result.status !== 'success') {
				toast.error(t(result.error))
				return
			}

			toast.success(t('login-successfully'))
			router.push('/members')
			router.refresh()
		})
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
								<SocialLogin />
								<div className='flex justify-center hover:underline text-sm text-pink-950 pt-2'>
									<Link href='/forgot-password'>{t('forgot-password')}</Link>
								</div>
							</div>
						</form>
					</CardBody>
				</Card>
			)}
		</>
	)
}
export default LoginForm
