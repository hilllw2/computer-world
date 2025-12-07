'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTicketAction(formData: FormData) {
    const { user, profile } = await getCurrentUserAndProfile()

    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const orderId = formData.get('orderId') as string // Optional

    if (!email || !subject || !message) {
        return { error: 'Please fill in all required fields.' }
    }

    const supabase = await createClient()

    // 1. Create Ticket
    const ticketNumber = `TICKET-${Date.now()}`

    const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
            ticket_number: ticketNumber,
            profile_id: profile?.id || null, // Can be null for guest
            email: email,
            subject: subject,
            status: 'open',
            priority: 'normal',
            order_id: orderId || null
        })
        .select()
        .single()

    if (ticketError) {
        console.error('Ticket creation error:', ticketError)
        return { error: 'Failed to create ticket.' }
    }

    // 2. Create Initial Message
    const { error: msgError } = await supabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticket.id,
            sender_role: 'customer',
            sender_profile_id: profile?.id || null,
            message: message
        })

    if (msgError) {
        console.error('Message creation error:', msgError)
        // Should probably delete ticket here to avoid orphans, but for now just error
        return { error: 'Failed to save message.' }
    }

    if (profile) {
        revalidatePath('/account/tickets')
        redirect(`/account/tickets/${ticket.id}`)
    } else {
        // Guest flow - maybe redirect to a success page or just return success to show a modal
        return { success: true, ticketNumber }
    }
}
