/* eslint-disable @typescript-eslint/no-explicit-any */

import { Channel, Members } from 'pusher-js'
import { useCallback, useEffect, useRef } from 'react'
import { PRESENCE_PUSHER } from 'types/enums'

import { pusherClient } from '@/lib/pusher'

import usePresenceStore from './usePresenceStore'

export const usePresenceChannel = () => {
	const { set, add, remove } = usePresenceStore((state) => ({
		set: state.set,
		add: state.add,
		remove: state.remove,
	}))

	const channelRef = useRef<Channel | null>(null)

	const handleSetMembers = useCallback(
		(memberIds: string[]) => {
			set(memberIds)
		},
		[set]
	)

	const handleAddMember = useCallback(
		(memberId: string) => {
			add(memberId)
		},
		[add]
	)

	const handleRemoveMember = useCallback(
		(memberId: string) => {
			remove(memberId)
		},
		[remove]
	)

	useEffect(() => {
		if (!channelRef.current) {
			channelRef.current = pusherClient.subscribe(PRESENCE_PUSHER.presenceNm)
			channelRef.current.bind(
				PRESENCE_PUSHER.subscriptionSucceeded,
				(members: Members) => {
					handleSetMembers(Object.keys(members.members))
				}
			)

			channelRef.current.bind(
				PRESENCE_PUSHER.memberAdded,
				(member: Record<string, any>) => {
					handleAddMember(member.id)
				}
			)

			channelRef.current.bind(
				PRESENCE_PUSHER.memberRemoved,
				(member: Record<string, any>) => {
					handleRemoveMember(member.id)
				}
			)
		}

		return () => {
			if (channelRef.current?.subscribed) {
				channelRef.current.unsubscribe()

				channelRef.current.unbind(
					PRESENCE_PUSHER.subscriptionSucceeded,
					handleSetMembers
				)
				channelRef.current.unbind(PRESENCE_PUSHER.memberAdded, handleAddMember)
				channelRef.current.unbind(
					PRESENCE_PUSHER.memberRemoved,
					handleRemoveMember
				)
			}
		}
	}, [handleAddMember, handleRemoveMember, handleSetMembers])
}
