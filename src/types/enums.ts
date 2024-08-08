export enum MESSAGE_SIDEBAR_KEYS {
	inbox = 'inbox',
	outbox = 'outbox',
}

export enum MESSAGE_QUERY {
	senderId = 'senderId',
	recipientId = 'recipientId',
}

export enum MESSAGE_TABLE_KEYS {
	recipientName = 'recipientName',
	senderName = 'senderName',
	text = 'text',
	created = 'created',
	actions = 'actions',
}

export enum MESSAGE_DELETE_KEYS {
	senderDeleted = 'senderDeleted',
	recipientDeleted = 'recipientDeleted',
}

export enum MESSAGE_PUSHER_EVENTS {
	messageNew = 'message:new',
	messagesRead = 'messages:read',
}

export enum PRESENCE_PUSHER {
	presenceNm = 'presence-nm',
	subscriptionSucceeded = 'pusher:subscription_succeeded',
	memberAdded = 'pusher:member_added',
	memberRemoved = 'pusher:member_removed',
}
