'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function replyToTicketAction(ticketId: string, message: string) {
    const { user, profile } = await getCurrentUserAndProfile()

    if (!user || !profile) {
        return { error: 'Unauthorized' }
    }

    if (!message) {
        return { error: 'Message cannot be empty.' }
    }

    const supabase = await createClient()

    // Verify ownership (or admin)
    // For now assuming user can only reply to their own tickets if we checked ownership in page load.
    // But strictly we should check here too.
    const { data: ticket } = await supabase.from('support_tickets').select('profile_id').eq('id', ticketId).single()
    if (!ticket || ticket.profile_id !== profile.id) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticketId,
            sender_role: 'customer',
            sender_profile_id: profile.id,
            message: message
        })

    if (error) {
        return { error: 'Failed to send reply.' }
    }

    // Update ticket updated_at
    await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId)

    revalidatePath(`/account/tickets/${ticketId}`)
    return { success: true }
}
