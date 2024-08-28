import { Selection } from '@nextui-org/react'
import { usePathname, useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useTransition } from 'react'
import { FaFemale, FaMale } from 'react-icons/fa'
import { GENDERS, ORDER_BY_LIST } from 'types/enums'

import useFilterStore from './useFilterStore'
import usePaginationStore from './usePaginationStore'

export const useFilters = () => {
	const t = useTranslations('filters')
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const { pageNumber, pageSize, setPage } = usePaginationStore((state) => ({
		pageNumber: state.pagination.pageNumber,
		pageSize: state.pagination.pageSize,
		setPage: state.setPage,
	}))
	const { filters, setFilters } = useFilterStore()
	const { gender, ageRange, orderBy, withPhotoOnly } = filters

	useEffect(() => {
		if (gender || ageRange || orderBy || withPhotoOnly) {
			setPage(1)
		}
	}, [ageRange, gender, orderBy, setPage, withPhotoOnly])

	useEffect(() => {
		startTransition(() => {
			const searchParams = new URLSearchParams()

			if (gender) searchParams.set('gender', gender.join(','))
			if (ageRange) searchParams.set('ageRange', ageRange.toString())
			if (gender) searchParams.set('orderBy', orderBy)
			if (pageSize) searchParams.set('pageSize', pageSize.toString())
			if (pageNumber) searchParams.set('pageNumber', pageNumber.toString())
			searchParams.set('withPhotoOnly', withPhotoOnly.toString())

			router.replace(`${pathname}?${searchParams}`)
		})
	}, [
		ageRange,
		gender,
		orderBy,
		pageNumber,
		pageSize,
		pathname,
		router,
		withPhotoOnly,
	])

	const orderByList = [
		{
			label: t('last-active'),
			value: ORDER_BY_LIST.updated,
		},
		{
			label: t('newest-members'),
			value: ORDER_BY_LIST.created,
		},
	]

	const genderList = [
		{
			value: GENDERS.male,
			icon: FaMale,
		},
		{
			value: GENDERS.female,
			icon: FaFemale,
		},
	]

	const handleAgeSelect = (value: number[]) => {
		setFilters('ageRange', value)
	}

	const handleOrderSelect = (value: Selection) => {
		if (value instanceof Set) {
			setFilters('orderBy', value.values().next().value)
		}
	}

	const handleGenderSelect = (value: GENDERS) => {
		gender.includes(value)
			? setFilters(
					'gender',
					gender.filter((g) => g !== value)
			  )
			: setFilters('gender', [...gender, value])
	}

	const handlePhotoSelect = (value: boolean) => {
		setFilters('withPhotoOnly', value)
	}

	return {
		orderByList,
		genderList,
		selectAge: handleAgeSelect,
		selectGender: handleGenderSelect,
		selectOrder: handleOrderSelect,
		selectWithPhotoOnly: handlePhotoSelect,
		isPending,
		filters,
		t,
	}
}
