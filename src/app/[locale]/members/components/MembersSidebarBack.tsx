'use client'

import { Button } from '@nextui-org/react'
import { Link } from 'navigation'
import { useTranslations } from 'next-intl'
import { FaArrowLeft } from 'react-icons/fa'

export const MembersSidebarBack = () => {
	const t = useTranslations('members-sidebar')

	return (
		<Button
			as={Link}
			href='/members'
			fullWidth
			variant='bordered'
			startContent={<FaArrowLeft className='text-gray-400' />}
		>
			{t('back-btn')}
		</Button>
	)
}
