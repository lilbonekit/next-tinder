'use client'

import { Tab, Tabs } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { Key } from '@react-types/shared'
import { MembersCardClient } from 'app/[locale]/members/components/MembersCardClient'
import { usePathname, useRouter } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { LoadingComponent } from '@/components/LoadingComponent'

interface ListTabsProps {
	members: Member[]
	likeIds: string[]
}

export const ListTabs = ({ members, likeIds }: ListTabsProps) => {
	const t = useTranslations('list-tabs')
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const tabs = [
		{ id: 'source', label: t('source-lbl') },
		{ id: 'target', label: t('target-lbl') },
		{ id: 'mutual', label: t('mutual-lbl') },
	]

	const handleTabChange = (key: Key) => {
		startTransition(() => {
			const params = new URLSearchParams(searchParams)
			params.set('type', key.toString())
			router.replace(`${pathname}?${params.toString()}`)
		})
	}

	return (
		<Tabs
			className='flex flex-col mt-10 gap-5 w-full lg:w-2/5 mx-auto'
			aria-label={t('aria-label')}
			items={tabs}
			onSelectionChange={(key) => handleTabChange(key)}
		>
			{(item) => (
				<Tab key={item.id} title={item.label}>
					{isPending ? (
						<LoadingComponent />
					) : (
						<>
							{members.length ? (
								<div className='mt-5 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8'>
									{members.map((member) => (
										<MembersCardClient
											key={member.id}
											member={member}
											likeIds={likeIds}
										/>
									))}
								</div>
							) : (
								<span className='fixed inset-0 flex justify-center items-center text-neutral-500 font-light z-[-1]'>
									{t('no-members')}
								</span>
							)}
						</>
					)}
				</Tab>
			)}
		</Tabs>
	)
}
