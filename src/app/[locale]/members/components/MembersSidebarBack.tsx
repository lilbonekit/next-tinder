'use client'

import { Button } from '@nextui-org/react'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { FaArrowLeft } from 'react-icons/fa'

export const MembersSidebarBack = () => {
	const t = useTranslations('members-sidebar')
	const router = useRouter()

	return (
		<Button
			onClick={() => router.back()}
			fullWidth
			variant='bordered'
			startContent={<FaArrowLeft className='text-gray-400' />}
		>
			{t('back-btn')}
		</Button>
	)
}
