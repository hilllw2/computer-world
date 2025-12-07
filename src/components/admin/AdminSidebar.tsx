'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LifeBuoy, Wrench, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/categories', icon: Package },
    { name: 'Brands', href: '/admin/brands', icon: Package },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Tickets', href: '/admin/tickets', icon: LifeBuoy },
    { name: 'Repairs', href: '/admin/repairs', icon: Wrench },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white w-64">
            <div className="flex items-center justify-center h-16 bg-gray-800">
                <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    // Special case for dashboard to avoid matching everything
                    const isDashboard = item.href === '/admin'
                    const active = isDashboard ? pathname === '/admin' : isActive

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                active
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
                                    'mr-3 h-6 w-6 flex-shrink-0'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                >
                    <LogOut className="mr-3 h-6 w-6 text-gray-400" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
