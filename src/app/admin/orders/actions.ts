'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatusAction(orderId: string, status: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) return { error: 'Failed to update status' }

    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/orders')
    return { success: true }
}
