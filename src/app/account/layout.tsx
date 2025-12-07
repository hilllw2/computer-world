import { getCurrentUserAndProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, profile } = await getCurrentUserAndProfile()

    if (!user || !profile) {
        redirect('/auth/login?redirect=/account')
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
                    <AccountSidebar />
                </aside>
                <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
