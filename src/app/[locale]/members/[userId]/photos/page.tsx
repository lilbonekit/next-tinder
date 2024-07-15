import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import {
	getMemberByUserId,
	getMemberPhotosByUserId,
} from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { MemberDetailedPageProps } from '../page'

const GalleryPage = async ({ params: { userId } }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)
	const photos = await getMemberPhotosByUserId(userId)
	const t = await getTranslations('member-detailed')

	if (!member) return notFound()

	return (
		<>
			<CardHeader className='text-2xl font-light text-pink-500 justify-center'>
				{t('photos', { name: member.name })}
			</CardHeader>
			<Divider />
			<CardBody>
				<div className='grid grid-cols-5 gap-3'>
					{photos &&
						photos.map((photo) => (
							<div key={photo.id}>
								<Image
									width={300}
									height={300}
									src={photo.url}
									alt={t('photos-alt')}
									className='object-cover aspect-square'
								/>
							</div>
						))}
				</div>
			</CardBody>
		</>
	)
}

export default GalleryPage
