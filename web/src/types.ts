export type Connection = {
  id: string
  clientId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Contact = {
  id: string
  clientId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export type MessageStatus = 'scheduled' | 'sent'

export type Message = {
  id: string
  clientId: string
  connectionId: string
  body: string
  contactIds: string[]
  status: MessageStatus
  scheduledAt: Date | null
  sentAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type ConnectionInput = Pick<Connection, 'name'>

export type ContactInput = Pick<Contact, 'name' | 'phone'>

export type MessageInput = {
  body: string
  contactIds: string[]
  scheduledAt: Date | null
}

export type Unsubscribe = () => void

export type Subscriber<T> = (onNext: (data: T) => void, onError: (error: Error) => void) => Unsubscribe
