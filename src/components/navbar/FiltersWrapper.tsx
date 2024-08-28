'use client'

import { usePathname } from 'navigation'

import { Filters } from './Filters'

export const FiltersWrapper = () => {
	const pathname = usePathname()
	if (pathname !== '/members') return null

	return <Filters />
}
