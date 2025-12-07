'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function adminReplyToTicketAction(ticketId: string, message: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    if (!message) return { error: 'Message cannot be empty' }

    const supabase = await createClient()

    const { error } = await supabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticketId,
            sender_role: 'support', // or 'admin'
            sender_profile_id: profile.id,
            message: message
        })

    if (error) return { error: 'Failed to send reply' }

    // Update ticket status to 'in_progress' or 'resolved' if needed, or just updated_at
    await supabase.from('support_tickets').update({
        updated_at: new Date().toISOString(),
        status: 'in_progress' // Auto-move to in_progress on reply
    }).eq('id', ticketId)

    revalidatePath(`/admin/tickets/${ticketId}`)
    return { success: true }
}
