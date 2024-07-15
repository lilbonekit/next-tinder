import { Card, Image } from '@nextui-org/react'
import { getTranslations } from 'next-intl/server'

const NotFound = async () => {
	const t = await getTranslations('not-found')

	return (
		<div className='flex items-center justify-center vertical-center flex-col gap-2'>
			<Image
				src='/images/not-found.png'
				alt={t('alt')}
				width={300}
				height={300}
			/>
			<Card className='w-full lg:w-2/5 mx-auto flex justify-center items-center p-5 gap-1 lg:gap-2'>
				<h2 className=' text-2xl lg:text-3xl font-light text-main-gradient text-center'>
					{t('title')}
				</h2>
				<p className='text-neutral-500 text-center text-sm lg:text-base'>
					{t('description')}
				</p>
			</Card>
		</div>
	)
}

export default NotFound
