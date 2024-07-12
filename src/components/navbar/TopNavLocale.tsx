'use client'

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Selection,
	Spinner,
} from '@nextui-org/react'
import { usePathname, useRouter } from 'navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { RiGlobalLine } from 'react-icons/ri'

const TopNavLocale = () => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['']))
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const selectedValue = useMemo(
		() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
		[selectedKeys]
	)
	const locale = useLocale()
	const t = useTranslations('locale-btn')
	const router = useRouter()
	const pathname = usePathname()

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
				aria-label={t('aria-label')}
				variant='flat'
				disallowEmptySelection
				selectionMode='single'
				closeOnSelect={false}
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
			>
				<DropdownItem
					key='en'
					onClick={() => router.replace(pathname, { locale: 'en' })}
				>
					{t('en')}
				</DropdownItem>
				<DropdownItem
					key='ua'
					onClick={() => router.replace(pathname, { locale: 'ua' })}
				>
					{t('ua')}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default TopNavLocale
