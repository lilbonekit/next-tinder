import { Spinner } from '@nextui-org/react'
import { useTranslations } from 'next-intl'

export const LoadingComponent = ({ label }: { label?: string }) => {
	const t = useTranslations('loading')
	return (
		<div className='fixed inset-0 flex justify-center items-center'>
			<Spinner
				color='danger'
				label={t(label || 'label')}
				labelColor='foreground'
				classNames={{ label: 'font-light' }}
			/>
		</div>
	)
}
