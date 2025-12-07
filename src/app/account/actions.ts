'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { createAddress } from '@/lib/db/addresses'

export async function updateProfileAction(formData: FormData) {
    const { user } = await getCurrentUserAndProfile()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    const supabase = await createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ name, phone })
        .eq('auth_uid', user.id)

    if (error) return { error: 'Failed to update profile' }

    revalidatePath('/account/profile')
    return { success: true }
}

export async function deleteAddressAction(addressId: string) {
    const { user } = await getCurrentUserAndProfile()
    if (!user) return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        // Ensure user owns address via RLS or explicit check. 
        // Since we don't have RLS enabled yet per schema (rls_enabled: false in list_tables output earlier),
        // we should ideally check ownership. But for now, let's assume RLS or trust.
        // Actually, let's add a check for safety if RLS isn't on.
        .eq('profile_id', (await supabase.from('profiles').select('id').eq('auth_uid', user.id).single()).data?.id)

    if (error) return { error: 'Failed to delete address' }

    revalidatePath('/account/addresses')
    return { success: true }
}

export async function addAddressAction(formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (!profile) return { error: 'Unauthorized' }

    const label = formData.get('label') as string
    const line1 = formData.get('line1') as string
    const city = formData.get('city') as string
    const phone = formData.get('phone') as string

    try {
        await createAddress(profile.id, {
            label,
            full_name: profile.name,
            phone,
            line1,
            line2: null,
            city,
            province: null,
            postal_code: null,
            country: 'Pakistan',
            is_default: false
        })
        revalidatePath('/account/addresses')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to add address' }
    }
}
