import { createClient } from '@/lib/supabase/server'

export type Address = {
    id: string
    profile_id: string
    label: string | null
    full_name: string | null
    phone: string | null
    line1: string
    line2: string | null
    city: string
    province: string | null
    postal_code: string | null
    country: string
    is_default: boolean
}

export async function getAddresses(profileId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('profile_id', profileId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching addresses:', error)
        return []
    }
    return data as Address[]
}

export async function createAddress(profileId: string, address: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('addresses')
        .insert({ ...address, profile_id: profileId })
        .select()
        .single()

    if (error) throw error
    return data
}
