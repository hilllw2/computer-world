import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OrderStatusUpdater from '@/components/admin/orders/OrderStatusUpdater'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: order } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(title), variant:product_variants(title)), shipping_address:addresses(*), profile:profiles(email, name)')
        .eq('id', id)
        .single()

    if (!order) notFound()

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.profile?.name || 'N/A'}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.profile?.email}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {order.shipping_address ? (
                                    <>
                                        {order.shipping_address.line1}<br />
                                        {order.shipping_address.city}, {order.shipping_address.country}<br />
                                        {order.shipping_address.phone}
                                    </>
                                ) : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                        {order.items.map((item: any) => (
                            <li key={item.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.product?.title} - {item.variant?.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.quantity} x ${item.price} = ${item.line_total}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                    <div className="text-base font-medium text-gray-900">Total: ${order.total_amount}</div>
                </div>
            </div>
        </div>
    )
}
