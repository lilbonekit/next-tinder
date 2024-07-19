import {
	fetchCurrentUserLikeIds,
	fetchLikedMembers,
} from 'app/actions/likeActions'

import { ListTabs } from './components/ListTabs'

const ListsPage = async ({
	searchParams,
}: {
	searchParams: { type: string }
}) => {
	const likedIds = await fetchCurrentUserLikeIds()
	const members = await fetchLikedMembers(searchParams.type)

	return (
		<div>
			<ListTabs members={members} likeIds={likedIds} />
		</div>
	)
}
export default ListsPage
