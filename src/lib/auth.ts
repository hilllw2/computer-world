import { createClient } from '@/lib/supabase/server'

export async function getCurrentUserAndProfile() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { user: null, profile: null }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

    if (!profile) {
        // Auto-create profile if it doesn't exist
        // This handles the "Option A" requirement
        const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert({
                auth_uid: user.id,
                email: user.email,
                role: 'customer' // CHANGED: 'user' -> 'customer' based on enum error
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating profile:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                fullError: error
            })
            // If creation fails (e.g. duplicate key race condition), try fetching again
            const { data: retryProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_uid', user.id)
                .single()

            return { user, profile: retryProfile }
        }

        return { user, profile: newProfile }
    }

    return { user, profile }
}
