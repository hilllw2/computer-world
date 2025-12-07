import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: orders } = await supabase
        .from('orders')
        .select('*, profile:profiles(email)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {orders?.map((order) => (
                        <li key={order.id}>
                            <Link href={`/admin/orders/${order.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate">Order #{order.order_number}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {order.profile?.email}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Total: ${order.total_amount}</p>
                                            <p className="ml-4">
                                                <time dateTime={order.created_at}>{new Date(order.created_at).toLocaleDateString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
