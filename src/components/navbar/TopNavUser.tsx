'use client'

import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	User,
} from '@nextui-org/react'
import { signOutUser } from 'app/actions/authActions'
import { Link, useRouter } from 'navigation'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { RiEditCircleLine, RiLogoutCircleLine } from 'react-icons/ri'

type TopNavUserProps = {
	user: Session['user']
}

const TopNavUser = ({ user }: TopNavUserProps) => {
	const t = useTranslations('top-nav-user')
	const router = useRouter()

	const handleLogOut = async () => {
		await signOutUser()
		router.push('/login')
		router.refresh()
	}

	return (
		<Dropdown backdrop='blur'>
			<DropdownTrigger>
				<Avatar
					showFallback
					as='button'
					className='transition-transform light-gradient'
					classNames={{ name: 'font-semibold text-main-gradient' }}
					color='default'
					size='md'
					name={user?.name || t('user-avatar')}
					{...(user?.image ? { src: user.image } : {})}
				/>
			</DropdownTrigger>
			<DropdownMenu variant='flat' aria-label={t('aria-label')}>
				<DropdownSection showDivider>
					<DropdownItem
						isReadOnly
						as='span'
						aria-label={t('aria-label-username')}
					>
						<User
							name={user?.name}
							description={user?.email}
							avatarProps={{
								...(user?.image ? { src: user?.image } : {}),
								showFallback: true,
								className: 'transition-transform light-gradient',
								classNames: { name: 'font-semibold text-main-gradient' },
							}}
						/>
					</DropdownItem>
				</DropdownSection>
				<DropdownItem
					as={Link}
					href='/members/edit'
					startContent={
						<RiEditCircleLine size={18} className='text-gray-400' />
					}
				>
					{t('edit-profile')}
				</DropdownItem>
				<DropdownItem
					color='danger'
					className='text-danger'
					onClick={handleLogOut}
					startContent={
						<RiLogoutCircleLine size={18} className='text-danger' />
					}
				>
					{t('log-out')}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default TopNavUser
