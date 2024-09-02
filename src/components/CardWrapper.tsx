import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { ReactNode } from 'react'

import { LoadingComponent } from './LoadingComponent'

interface CardWrapperProps {
	isPending?: boolean
	body?: ReactNode
	title?: string
	description?: string
}

export const CardWrapper = (props: CardWrapperProps) => {
	const { isPending, title, description, body } = props

	return (
		<div className='flex items-center justify-center vertical-center'>
			{isPending ? (
				<LoadingComponent />
			) : (
				<Card className='lg:w-2/5 mx-auto w-full p-2'>
					<CardHeader className='flex flex-col items-center justify-center'>
						<div className='flex flex-col gap-2 items-center'>
							<div className='flex flex-row items-center gap-3 text-pink-950'>
								<h1 className='text-3xl font-light'>{title}</h1>
							</div>
							{description && (
								<p className='text-neutral-500 text-center'>{description}</p>
							)}
						</div>
					</CardHeader>
					{body && <CardBody>{body}</CardBody>}
				</Card>
			)}
		</div>
	)
}
