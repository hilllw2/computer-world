'use client'

import { createProductAction } from '@/app/admin/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Category, Brand } from '@/lib/db/products'

interface CreateProductFormProps {
    categories: Category[]
    brands: Brand[]
}

export default function CreateProductForm({ categories, brands }: CreateProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)

        const result = await createProductAction(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>

            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                <input type="text" name="slug" id="slug" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="categoryId" name="categoryId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">Brand</label>
                    <select id="brandId" name="brandId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                        <option value="">Select Brand</option>
                        {brands?.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input type="number" name="basePrice" id="basePrice" step="0.01" required className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" name="image" id="image" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <div className="flex items-start">
                <div className="flex h-5 items-center">
                    <input id="active" name="active" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-medium text-gray-700">Active</label>
                    <p className="text-gray-500">Product is visible in the store.</p>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Product'}
                </button>
            </div>
        </form>
    )
}
