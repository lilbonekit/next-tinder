'use client'

import { Button } from '@nextui-org/react'
import { useRouter } from 'navigation'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
interface RedirectActionsProps {
	session: Session | null
}

export const RedirectActions = ({ session }: RedirectActionsProps) => {
	const t = useTranslations('start-page')
	const router = useRouter()

	return (
		<>
			{session && (
				<Button
					className='main-gradient'
					size='lg'
					type='submit'
					color='primary'
					onClick={() => router.push('/members')}
				>
					<span className='text-light-gradient'>{t('continue-lbl')}</span>
				</Button>
			)}
		</>
	)
}
