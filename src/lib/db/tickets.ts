import { createClient } from '@/lib/supabase/server'

export type Ticket = {
    id: string
    ticket_number: string
    profile_id: string
    order_id: string | null
    email: string | null
    subject: string | null
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: string
    created_at: string
    updated_at: string
}

export type TicketMessage = {
    id: string
    ticket_id: string
    sender_role: 'customer' | 'admin' | 'support'
    sender_profile_id: string | null
    message: string
    attachments: any
    created_at: string
}

export type TicketWithMessages = Ticket & {
    messages: TicketMessage[]
}

export async function getTickets(profileId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('profile_id', profileId)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching tickets:', error)
        return []
    }
    return data as Ticket[]
}

export async function getTicketWithMessages(ticketId: string) {
    const supabase = await createClient()

    const { data: ticket, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single()

    if (error || !ticket) return null

    const { data: messages, error: msgError } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

    if (msgError) return null

    return { ...ticket, messages: messages || [] } as TicketWithMessages
}
