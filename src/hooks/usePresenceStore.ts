import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PresenceState {
	members: string[]
	add: (id: string) => void
	remove: (id: string) => void
	set: (id: string[]) => void
}

const usePresenceStore = create<PresenceState>()(
	devtools(
		(set) => ({
			members: [],
			add: (id) =>
				set((state) => ({
					members: [...state.members, id],
				})),
			remove: (id) =>
				set((state) => ({
					members: state.members.filter((member) => member !== id),
				})),
			set: (ids) => set({ members: ids }),
		}),
		{ name: 'presenceStore' }
	)
)

export default usePresenceStore
