'use client'

import { Button } from '@nextui-org/react'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { HiMiniCheckBadge } from 'react-icons/hi2'

export const Body = () => {
	const t = useTranslations('register-success')
	const router = useRouter()

	return (
		<div className='flex flex-col gap-6'>
			<HiMiniCheckBadge className='text-success-500 mx-auto' size={100} />
			<Button
				fullWidth
				className='main-gradient'
				size='lg'
				type='submit'
				color='primary'
				onClick={() => router.push('/login')}
			>
				<span className='text-light-gradient'>{t('login-btn')}</span>
			</Button>
		</div>
	)
}
