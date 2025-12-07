import { createClient } from '@/lib/supabase/server'

export type CustomBuild = {
    id: string
    profile_id: string
    title: string | null
    notes: string | null
    status: 'draft' | 'submitted' | 'built' | 'shipped' | 'cancelled'
    total_price: number
    created_at: string
    updated_at: string
}

export async function getBuilds(profileId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('custom_builds')
        .select('*')
        .eq('profile_id', profileId)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching builds:', error)
        return []
    }
    return data as CustomBuild[]
}
