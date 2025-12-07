'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

export default function Header({ user }: { user: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Don't show header on admin pages
    if (pathname.startsWith('/admin')) return null

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="flex w-full items-center justify-between border-b border-gray-200 py-4 lg:border-none">
                    <div className="flex items-center">
                        <Link href="/">
                            <span className="sr-only">Computer World</span>
                            <span className="text-2xl font-bold text-blue-600">Computer World</span>
                        </Link>
                        <div className="hidden ml-10 space-x-8 lg:block">
                            <Link href="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Home
                            </Link>
                            <Link href="/build-pc" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Build PC
                            </Link>
                            <Link href="/repairs" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Repairs
                            </Link>
                            <Link href="/support" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Support
                            </Link>
                        </div>
                    </div>
                    <div className="ml-10 space-x-4 flex items-center">
                        <Link href="/cart" className="text-gray-400 hover:text-gray-500 relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="sr-only">Cart</span>
                        </Link>

                        {user ? (
                            <Link href="/account" className="text-gray-400 hover:text-gray-500 flex items-center">
                                <User className="h-6 w-6" />
                                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">Account</span>
                            </Link>
                        ) : (
                            <div className="hidden sm:flex space-x-4">
                                <Link href="/auth/login" className="text-base font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                                <Link href="/auth/register" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700">
                                    Sign up
                                </Link>
                            </div>
                        )}

                        <div className="lg:hidden">
                            <button
                                type="button"
                                className="-mr-2 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="sr-only">Open menu</span>
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="py-4 flex flex-col space-y-4 lg:hidden border-t border-gray-200">
                        <Link href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                            Home
                        </Link>
                        <Link href="/build-pc" className="text-base font-medium text-gray-900 hover:text-gray-700">
                            Build PC
                        </Link>
                        <Link href="/repairs" className="text-base font-medium text-gray-900 hover:text-gray-700">
                            Repairs
                        </Link>
                        <Link href="/support" className="text-base font-medium text-gray-900 hover:text-gray-700">
                            Support
                        </Link>
                        {!user && (
                            <div className="mt-4 flex flex-col space-y-2">
                                <Link href="/auth/login" className="text-base font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                                <Link href="/auth/register" className="text-base font-medium text-blue-600 hover:text-blue-500">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}
