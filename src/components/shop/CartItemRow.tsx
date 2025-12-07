'use client'

import { useState } from 'react'
import { CartItemWithDetails } from '@/lib/db/cart'
import { updateQuantityAction, removeItemAction } from '@/app/cart/actions'
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function CartItemRow({ item }: { item: CartItemWithDetails }) {
    const [updating, setUpdating] = useState(false)

    const handleUpdate = async (newQty: number) => {
        if (newQty < 1) return
        setUpdating(true)
        await updateQuantityAction(item.id, newQty)
        setUpdating(false)
    }

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove this item?')) return
        setUpdating(true)
        await removeItemAction(item.id)
        setUpdating(false)
    }

    const imageUrl = item.variant.product.images?.[0]?.storage_path
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.variant.product.images[0].storage_path}`
        : 'https://placehold.co/100x100?text=No+Image'

    return (
        <li className="flex py-6 sm:py-10">
            <div className="flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={item.variant.product.title}
                    className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                        <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link href={`/product/${item.variant.product.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                                    {item.variant.product.title}
                                </Link>
                            </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.variant.title}</p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">${item.variant.price}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleUpdate(item.quantity - 1)}
                                disabled={updating || item.quantity <= 1}
                                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-gray-900 font-medium w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => handleUpdate(item.quantity + 1)}
                                disabled={updating}
                                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                            >
                                <Plus size={16} />
                            </button>
                            {updating && <Loader2 className="animate-spin h-4 w-4 ml-2 text-blue-600" />}
                        </div>

                        <div className="absolute right-0 top-0">
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={updating}
                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Remove</span>
                                <Trash2 className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}
