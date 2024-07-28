'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { updateMemberProfile } from 'app/actions/userActions'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
	MemberEditSchema,
	memberEditSchema,
} from '@/lib/schemas/memberEditSchema'
import { getErrorMessage, handleFormServerErrors } from '@/lib/util'

interface EditFormProps {
	member: Member
}

export const EditForm = ({ member }: EditFormProps) => {
	const t = useTranslations('edit-form')
	const router = useRouter()
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting, isValid, isDirty },
	} = useForm<MemberEditSchema>({
		resolver: zodResolver(memberEditSchema),
		mode: 'onTouched',
	})

	const onSubmit = async (data: MemberEditSchema) => {
		const isNameUpdated = data.name !== member.name
		const result = await updateMemberProfile(data, isNameUpdated)

		if (result.status !== 'success') {
			toast.error(t(result.error))
			handleFormServerErrors(result, setError)
			return
		}

		toast.success(t('profile-updated'))
		router.refresh()
		reset({ ...data })
	}

	useEffect(() => {
		if (member) {
			reset({
				name: member.name,
				description: member.description,
				city: member.city,
				country: member.country,
			})
		}
	}, [member, reset])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input
				{...register('name')}
				size='md'
				autoComplete='name'
				variant='bordered'
				defaultValue={member.name}
				label={t('name-lbl')}
				isInvalid={!!errors.name}
				errorMessage={t(getErrorMessage(errors.name))}
			/>
			<Textarea
				{...register('description')}
				size='md'
				autoComplete='description'
				variant='bordered'
				minRows={6}
				defaultValue={member.description}
				label={t('description-lbl')}
				isInvalid={!!errors.description}
				errorMessage={t(getErrorMessage(errors.description))}
			/>
			<div className='flex space-x-2'>
				<Input
					{...register('city')}
					size='md'
					autoComplete='city'
					variant='bordered'
					defaultValue={member.city}
					label={t('city-lbl')}
					isInvalid={!!errors.city}
					errorMessage={t(getErrorMessage(errors.city))}
				/>
				<Input
					{...register('country')}
					size='md'
					autoComplete='country'
					variant='bordered'
					defaultValue={member.country}
					label={t('country-lbl')}
					isInvalid={!!errors.country}
					errorMessage={t(getErrorMessage(errors.country))}
				/>
			</div>
			{errors.root?.serverError && (
				<p className='text-danger text-sm'>
					{t(errors.root.serverError.message)}
				</p>
			)}
			<Button
				fullWidth
				className='main-gradient'
				size='lg'
				type='submit'
				color='primary'
				isLoading={isSubmitting}
				disabled={!isValid || !isDirty}
			>
				<span className='text-light-gradient'>{t('submit-lbl')}</span>
			</Button>
		</form>
	)
}
