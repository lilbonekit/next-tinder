'use client'

import { Chip } from '@nextui-org/react'
import clsx from 'clsx'
import { usePathname, useRouter } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PiArrowCircleLeft, PiArrowCircleRight } from 'react-icons/pi'
import { MESSAGE_SIDEBAR_KEYS } from 'types/enums'

export const MessageSidebar = () => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const [selected, setSelected] = useState<string>(
		searchParams.get('container') || MESSAGE_SIDEBAR_KEYS.inbox
	)
	const t = useTranslations('message-sidebar')

	const items = [
		{
			key: MESSAGE_SIDEBAR_KEYS.inbox,
			label: t('inbox-lbl'),
			icon: PiArrowCircleLeft,
			chip: true,
		},
		{
			key: MESSAGE_SIDEBAR_KEYS.outbox,
			label: t('outbox-lbl'),
			icon: PiArrowCircleRight,
			chip: false,
		},
	]

	const handleSelect = (key: MESSAGE_SIDEBAR_KEYS) => {
		setSelected(key)
		const params = new URLSearchParams(searchParams)
		params.set('container', key)
		router.replace(`${pathname}?${params}`)
	}

	return (
		<div className='flex flex-col shadow-md rounded-lg cursor-pointer p-3'>
			{items.map(({ key, icon: Icon, label, chip }) => (
				<div
					key={key}
					className={clsx(
						'flex flex-row gap-3 items-center text-small lg:text-base font-light rounded-large p-3 lg:py-2 hover:bg-default/40 hover:transition-colors',
						{
							'text-pink-500 hover:bg-pink-100': selected === key,
							'text-neutral-800': selected !== key,
						}
					)}
					onClick={() => handleSelect(key)}
				>
					<Icon
						size={24}
						className={clsx({
							'fill-current': selected === key,
							'text-gray-400': selected !== key,
						})}
					/>
					<div className='flex justify-between flex-grow'>
						<span>{label}</span>
						{chip && <Chip color='danger'>5</Chip>}
					</div>
				</div>
			))}
		</div>
	)
}
