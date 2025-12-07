'use client'

import { createVariantAction, deleteVariantAction } from '@/app/admin/products/[id]/actions'
import { useState } from 'react'
import { Loader2, Trash2, Plus } from 'lucide-react'

export default function ProductVariantsManager({ productId, variants }: { productId: string, variants: any[] }) {
    const [loading, setLoading] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const handleDelete = async (variantId: string) => {
        if (!confirm('Are you sure?')) return
        await deleteVariantAction(variantId, productId)
    }

    const handleAdd = async (formData: FormData) => {
        setLoading(true)
        await createVariantAction(productId, formData)
        setLoading(false)
        setIsAdding(false)
    }

    return (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Variants</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage product variants (e.g. different sizes, colors).</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="space-y-4">
                        {variants.map((variant) => (
                            <div key={variant.id} className="flex items-center justify-between border p-4 rounded-md">
                                <div>
                                    <p className="font-medium">{variant.title}</p>
                                    <p className="text-sm text-gray-500">Price: ${variant.price} | Stock: {variant.stock} | SKU: {variant.sku}</p>
                                </div>
                                <button onClick={() => handleDelete(variant.id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {!isAdding ? (
                            <button onClick={() => setIsAdding(true)} className="flex items-center text-sm text-blue-600 hover:text-blue-500">
                                <Plus size={16} className="mr-1" /> Add Variant
                            </button>
                        ) : (
                            <form action={handleAdd} className="border p-4 rounded-md bg-gray-50 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input type="text" name="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. 16GB RAM" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input type="number" name="price" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" name="stock" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                                        <input type="text" name="sku" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-gray-700 border rounded-md bg-white">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
