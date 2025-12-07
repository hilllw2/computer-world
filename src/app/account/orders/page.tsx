import { getCurrentUserAndProfile } from '@/lib/auth'
import { getOrdersList } from '@/lib/db/orders'
import Link from 'next/link'

export default async function OrdersPage() {
    const { profile } = await getCurrentUserAndProfile()
    const orders = await getOrdersList(profile!.id)

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Order History</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No orders found.</li>
                    ) : (
                        orders.map((order) => (
                            <li key={order.id}>
                                <Link href={`/account/orders/${order.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">Order #{order.order_number}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Placed on <time dateTime={order.created_at} className="ml-1">{new Date(order.created_at).toLocaleDateString()}</time>
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>Total: ${order.total_amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
