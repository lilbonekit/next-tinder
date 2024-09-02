'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/react'
import {
	completeSocialLoginProfile,
	signOutUser,
} from 'app/actions/authActions'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CardWrapper } from '@/components/CardWrapper'
import { ProfileSchema, profileSchema } from '@/lib/schemas/registerSchema'

import { ProfileForm } from '../../register/components/ProfileForm'

export const CompleteProfileForm = () => {
	const router = useRouter()
	const t = useTranslations('register-form')
	const methods = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		mode: 'onTouched',
	})

	const {
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = methods

	const onSubmit = async (data: ProfileSchema) => {
		const result = await completeSocialLoginProfile(data)

		if (result.status === 'success') {
			toast.success(t('profile-updated'))
			await signOutUser()
			router.refresh()
		}
	}
	return (
		<CardWrapper
			title={t('title-update')}
			description={t('description-update')}
			body={
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='space-y-2'>
							<ProfileForm />
							{errors.root?.serverError && (
								<p className='text-danger text-sm'>
									{t(errors.root.serverError.message)}
								</p>
							)}
							<div className='flex flex-row items-center gap-3'>
								<Button
									fullWidth
									isLoading={isSubmitting}
									isDisabled={!isValid}
									className='main-gradient'
									size='lg'
									type='submit'
									color='primary'
								>
									<span className='text-light-gradient'>{t('update-lbl')}</span>
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			}
		/>
	)
}
