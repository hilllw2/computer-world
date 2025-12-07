'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MapPin, Package, Monitor, LifeBuoy, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
    { name: 'Overview', href: '/account', icon: User },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Orders', href: '/account/orders', icon: Package },
    { name: 'PC Builds', href: '/account/builds', icon: Monitor },
    { name: 'Support Tickets', href: '/account/tickets', icon: LifeBuoy },
]

export function AccountSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="space-y-1">
            {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                            isActive
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <item.icon
                            className={clsx(
                                isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                            )}
                            aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                    </Link>
                )
            })}
            <button
                onClick={handleSignOut}
                className="w-full text-left group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
                <LogOut
                    className="text-gray-400 group-hover:text-gray-500 -ml-1 mr-3 h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                />
                <span className="truncate">Sign out</span>
            </button>
        </nav>
    )
}
