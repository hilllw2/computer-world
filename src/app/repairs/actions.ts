'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'

export async function createRepairRequestAction(formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()

    const deviceType = formData.get('deviceType') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const description = formData.get('description') as string
    const preferredDate = formData.get('preferredDate') as string

    if (!deviceType || !brand || !description) {
        return { error: 'Please fill in required fields.' }
    }

    const supabase = await createClient()

    const { error } = await supabase
        .from('repair_requests')
        .insert({
            profile_id: profile?.id || null,
            device_type: deviceType,
            brand: brand,
            model: model,
            description: description,
            preferred_visit_date: preferredDate || null,
            status: 'received'
        })

    if (error) {
        console.error('Repair request error:', error)
        return { error: 'Failed to submit request.' }
    }

    return { success: true }
}
