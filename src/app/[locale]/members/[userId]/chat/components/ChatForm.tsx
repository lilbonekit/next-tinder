'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { createMessage } from 'app/actions/messageAction'
import { useRouter } from 'navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi2'
import { toast } from 'react-toastify'

import { MessageSchema, messageSchema } from '@/lib/schemas/messageSchema'
import { handleFormServerErrors } from '@/lib/util'

export const ChatForm = () => {
	const router = useRouter()
	const params = useParams<{ userId: string }>()
	const t = useTranslations('chat-form')

	const {
		register,
		handleSubmit,
		reset,
		setError,
		setFocus,
		formState: { isSubmitting, isValid, errors },
	} = useForm<MessageSchema>({
		resolver: zodResolver(messageSchema),
	})

	useEffect(() => {
		setFocus('text')
	}, [setFocus])

	const onSubmit = async (data: MessageSchema) => {
		const result = await createMessage(params.userId, data)

		if (result.status !== 'success') {
			toast.error(t(result.error))
			handleFormServerErrors(result, setError)
			return
		}

		reset()
		router.refresh()
		setTimeout(() => setFocus('text'), 500)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='w-full'>
			<div className='flex gap-2'>
				<Input
					{...register('text')}
					fullWidth
					size='lg'
					placeholder={t('text-plh')}
					variant='flat'
					autoComplete='off'
					isInvalid={!!errors.root?.serverError}
				/>
				<Button
					type='submit'
					isIconOnly
					size='lg'
					radius='full'
					variant='flat'
					isLoading={isSubmitting}
					isDisabled={!isValid || isSubmitting}
				>
					<HiPaperAirplane size={18} />
				</Button>
			</div>
			<div className='flex flex-col pl-3'>
				{errors.root?.serverError && (
					<p className='text-danger text-sm'>
						{t(errors.root.serverError.message)}
					</p>
				)}
			</div>
		</form>
	)
}
