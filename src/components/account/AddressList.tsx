'use client'

import { deleteAddressAction, addAddressAction } from '@/app/account/actions'
import { Address } from '@/lib/db/addresses'
import { useState } from 'react'
import { Loader2, Trash2, Plus } from 'lucide-react'

export default function AddressList({ addresses }: { addresses: Address[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        await deleteAddressAction(id)
    }

    const handleAdd = async (formData: FormData) => {
        setLoading(true)
        await addAddressAction(formData)
        setLoading(false)
        setIsAdding(false)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                    <div key={addr.id} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-gray-400">
                        <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">{addr.label}</p>
                            <p className="truncate text-sm text-gray-500">{addr.line1}</p>
                            <p className="truncate text-sm text-gray-500">{addr.city}</p>
                            <p className="truncate text-sm text-gray-500">{addr.phone}</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                            className="z-10 text-gray-400 hover:text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setIsAdding(true)}
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Add a new address</span>
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Address</h3>
                        <form action={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Label</label>
                                <input type="text" name="label" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Home, Work, etc." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                <input type="text" name="line1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="text" name="phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
