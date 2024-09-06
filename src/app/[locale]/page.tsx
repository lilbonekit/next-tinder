import { Card, Image } from '@nextui-org/react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'

import { RedirectActions } from './components/RedirectActions'

export default async function Home() {
	const t = await getTranslations('start-page')
	const session = await auth()

	return (
		<div className='flex items-center justify-center vertical-center flex-col gap-2'>
			<Image
				src='/images/nt_logo.png'
				alt={t('alt')}
				width={300}
				height={300}
			/>
			<Card className='w-full lg:w-2/5 mx-auto flex justify-center items-center p-5 gap-1 lg:gap-2'>
				<div className='mb-5'>
					<h2 className=' text-2xl lg:text-3xl font-light text-main-gradient text-center'>
						{t('title')}
					</h2>
				</div>
				<RedirectActions session={session} />
			</Card>
		</div>
	)
}
