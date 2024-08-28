import { Member } from '@prisma/client'
import { fetchCurrentUserLikeIds } from 'app/actions/likeActions'
import { getMembers } from 'app/actions/membersActions'
import { getTranslations } from 'next-intl/server'
import { GetMemberParams } from 'types'

import { PaginationComponent } from '@/components/PaginationComponent'

import { MembersList } from './components/MembersList'

const Members = async ({ searchParams }: { searchParams: GetMemberParams }) => {
	const { items: members, totalCount } = await getMembers(searchParams)
	const likeIds = await fetchCurrentUserLikeIds()
	const t = await getTranslations('members')

	const isPaginationShown = Boolean(members?.length)

	return (
		<>
			<div className='my-10'>
				<MembersList
					members={members as Member[]}
					likeIds={likeIds}
					noUsersMessage={t('no-users')}
				/>
			</div>
			{isPaginationShown && <PaginationComponent totalCount={totalCount} />}
		</>
	)
}
export default Members
