import { getCurrentUserAndProfile } from '@/lib/auth'
import { getOrdersList } from '@/lib/db/orders'
import Link from 'next/link'

export default async function AccountOverviewPage() {
    const { profile } = await getCurrentUserAndProfile()
    const orders = await getOrdersList(profile!.id)
    const recentOrders = orders ? orders.slice(0, 3) : []

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Overview</h1>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.name || 'Not set'}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.email}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.phone || 'Not set'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                    <Link href="/account/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all
                    </Link>
                </div>
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {recentOrders.length === 0 ? (
                            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No orders yet.</li>
                        ) : (
                            recentOrders.map((order) => (
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
        </div>
    )
}
