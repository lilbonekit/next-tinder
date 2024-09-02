import { Spinner } from '@nextui-org/react'
import { getTranslations } from 'next-intl/server'

const Loading = async () => {
	const t = await getTranslations('loading')
	return (
		<div className='flex justify-center items-center vertical-center'>
			<Spinner
				color='danger'
				label={t('label')}
				labelColor='foreground'
				classNames={{ label: 'font-light' }}
			/>
		</div>
	)
}

export default Loading
