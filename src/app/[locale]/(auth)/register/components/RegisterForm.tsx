'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import { registerUser } from 'app/actions/authActions'
import { useRouter } from 'navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { REGISTER_FORM_STEPS } from 'types/enums'

import { LoadingComponent } from '@/components/LoadingComponent'
import {
	formRegisterSchema,
	profileSchema,
	RegisterSchema,
} from '@/lib/schemas/registerSchema'
import { handleFormServerErrors } from '@/lib/util'

import { ProfileForm } from './ProfileForm'
import { UserDetailsForm } from './UserDetailsForm'

const stepSchemas = [formRegisterSchema, profileSchema]

const RegisterForm = () => {
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('register-form')
	const router = useRouter()
	const [activeStep, setActiveStep] = useState(REGISTER_FORM_STEPS.userDetails)
	const currentValidationSchema = stepSchemas[activeStep]
	const locale = useLocale()

	const methods = useForm<RegisterSchema>({
		resolver: zodResolver(currentValidationSchema),
		mode: 'onTouched',
	})

	const {
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
		getValues,
	} = methods

	const onSubmit = async () => {
		const result = await registerUser(getValues(), locale)
		switch (result.status) {
			case 'success':
				startTransition(() => {
					router.push('/register/success')
				})
				break
			default:
				handleFormServerErrors(result, setError)
				break
		}
	}

	const getStepContent = (step: number) => {
		switch (step) {
			case REGISTER_FORM_STEPS.userDetails:
				return <UserDetailsForm />
			case REGISTER_FORM_STEPS.profileForm:
				return <ProfileForm />
			default:
				throw new Error('unknown-step')
		}
	}

	const onBack = () => {
		setActiveStep((prev) => prev - 1)
	}

	const onNext = async () => {
		if (activeStep === stepSchemas.length - 1) {
			await onSubmit()
			return
		}
		setActiveStep((prev) => prev + 1)
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
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit(onNext)}>
								<div className='space-y-2'>
									{getStepContent(activeStep)}
									{errors.root?.serverError && (
										<p className='text-danger text-sm'>
											{t(errors.root.serverError.message)}
										</p>
									)}
									<div className='flex flex-row items-center gap-3'>
										{activeStep !== 0 && (
											<Button
												onClick={onBack}
												fullWidth
												variant='bordered'
												size='lg'
											>
												{t('back-lbl')}
											</Button>
										)}
										<Button
											fullWidth
											isLoading={isSubmitting}
											className='main-gradient'
											size='lg'
											type='submit'
											color='primary'
										>
											<span className='text-light-gradient'>
												{activeStep === REGISTER_FORM_STEPS.profileForm
													? t('submit-lbl')
													: t('next-lbl')}
											</span>
										</Button>
									</div>
								</div>
							</form>
						</FormProvider>
					</CardBody>
				</Card>
			)}
		</>
	)
}

export default RegisterForm
