'use client'

import { updateProfileAction } from '@/app/account/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProfileForm({ initialData }: { initialData: { name: string, phone: string } }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)
        const result = await updateProfileAction(formData)
        setLoading(false)
        if (result.success) {
            setMessage('Profile updated successfully.')
        } else {
            setMessage('Failed to update profile.')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={initialData.name}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                defaultValue={initialData.phone}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save'}
                </button>
            </div>
        </form>
    )
}
