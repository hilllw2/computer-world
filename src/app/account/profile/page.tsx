import { getCurrentUserAndProfile } from '@/lib/auth'
import ProfileForm from '@/components/account/ProfileForm'

export default async function ProfilePage() {
    const { profile } = await getCurrentUserAndProfile()

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Profile</h1>
            <ProfileForm initialData={{ name: profile?.name || '', phone: profile?.phone || '' }} />
        </div>
    )
}
