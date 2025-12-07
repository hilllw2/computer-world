'use client'

import { updateProductAction } from '@/app/admin/products/[id]/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProductGeneralForm({ product }: { product: any }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        await updateProductAction(product.id, formData)
        setLoading(false)
        alert('Product updated')
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">General Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Basic details about the product.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" defaultValue={product.title} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                            <input type="text" name="slug" id="slug" defaultValue={product.slug} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" rows={3} defaultValue={product.description || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
                            <input type="number" name="basePrice" id="basePrice" step="0.01" defaultValue={product.base_price} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>

                        <div className="col-span-6 flex items-center">
                            <input id="active" name="active" type="checkbox" defaultChecked={product.active} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Active</label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
