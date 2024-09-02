import { Spinner } from '@nextui-org/react'
import { verifyEmail } from 'app/actions/authActions'
import { getTranslations } from 'next-intl/server'

import { CardWrapper } from '@/components/CardWrapper'
import { ResultMessage } from '@/components/ResultMessage'

interface VerifyEmailProps {
	searchParams: { token: string }
}

const VerifyEmail = async ({ searchParams }: VerifyEmailProps) => {
	const t = await getTranslations('verify-email')
	const result = await verifyEmail(searchParams.token)
	return (
		<CardWrapper
			title={t('title')}
			body={
				<div className='flex flex-col space-y-4 items-center'>
					<div className='flex flex-row items-center'>
						{!result && (
							<Spinner
								color='danger'
								label={t('verifying')}
								labelColor='foreground'
								classNames={{ label: 'font-light' }}
							/>
						)}
						<ResultMessage result={result} />
					</div>
				</div>
			}
		/>
	)
}

export default VerifyEmail
