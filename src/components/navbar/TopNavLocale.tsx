'use client'

import { useState, useMemo, useEffect } from 'react'
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Spinner,
	Button,
} from '@nextui-org/react'
import { RiGlobalLine } from 'react-icons/ri'
import { Selection } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'navigation'
import { useLocale } from 'next-intl'

const TopNavLocale = () => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['']))
	const [isLoading, setIsLoading] = useState<Boolean>(true)
	const selectedValue = useMemo(
		() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
		[selectedKeys],
	)
	const locale = useLocale()
	const t = useTranslations('locale-btn')
	const router = useRouter()

	useEffect(() => {
		setSelectedKeys(new Set([locale]) as Selection)
		setIsLoading(false)
	}, [locale])

	return (
		<Dropdown>
			{isLoading ? (
				<Spinner color='default' />
			) : (
				<DropdownTrigger>
					<Button
						variant='bordered'
						className='uppercase text-white'
						startContent={<RiGlobalLine size={20} />}
					>
						{selectedValue}
					</Button>
				</DropdownTrigger>
			)}

			<DropdownMenu
				aria-label='Single selection example'
				variant='flat'
				disallowEmptySelection
				selectionMode='single'
				closeOnSelect={false}
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
			>
				<DropdownItem
					key='en'
					onClick={() => router.replace('/', { locale: 'en' })}
				>
					{t('en')}
				</DropdownItem>
				<DropdownItem
					key='ua'
					onClick={() => router.replace('/', { locale: 'ua' })}
				>
					{t('ua')}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default TopNavLocale
