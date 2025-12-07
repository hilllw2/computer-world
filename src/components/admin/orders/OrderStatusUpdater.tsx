'use client'

import { updateOrderStatusAction } from '@/app/admin/orders/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoading(true)
        await updateOrderStatusAction(orderId, e.target.value)
        setLoading(false)
    }

    return (
        <div className="flex items-center">
            <label htmlFor="status" className="mr-2 text-sm font-medium text-gray-700">Status:</label>
            <div className="relative">
                <select
                    id="status"
                    value={currentStatus}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 pr-8"
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                {loading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    )
}
