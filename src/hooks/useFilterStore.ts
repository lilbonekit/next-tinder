import { UserFilters } from 'types'
import { GENDERS, ORDER_BY_LIST } from 'types/enums'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type UserFilterKeys = keyof UserFilters
type UserFilterValue = UserFilters[UserFilterKeys]

interface FilterState {
	filters: UserFilters
	setFilters: (filterName: UserFilterKeys, value: UserFilterValue) => void
}

const useFilterStore = create<FilterState>()(
	devtools((set) => ({
		filters: {
			ageRange: [18, 100],
			gender: [GENDERS.male, GENDERS.female],
			orderBy: ORDER_BY_LIST.updated,
		},
		setFilters: (filterName, value) =>
			set((state) => {
				return {
					filters: { ...state.filters, [filterName]: value },
				}
			}),
	}))
)

export default useFilterStore
