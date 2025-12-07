import { getCurrentUserAndProfile } from '@/lib/auth'
import { getOrder, OrderItem } from '@/lib/db/orders'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { user, profile } = await getCurrentUserAndProfile()

    if (!user || !profile) {
        redirect(`/auth/login?redirect=/account/orders/${id}`)
    }

    const order = await getOrder(id)

    if (!order) {
        notFound()
    }

    // Security check: ensure order belongs to user
    if (order.profile_id !== profile.id) {
        notFound()
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <div className="flex sm:items-baseline sm:space-x-4">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order #{order.order_number}</h1>
                        <Link href="/account/orders" className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 sm:block">
                            View all orders
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600">Order placed <time dateTime={order.created_at}>{new Date(order.created_at).toLocaleDateString()}</time></p>
                </div>

                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">{order.status}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Payment Method</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">{order.payment_method.replace('_', ' ')}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Total Amount</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">${order.total_amount}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Shipping Address</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {order.shipping_address ? (
                                    <>
                                        {order.shipping_address.label && <span className="block font-medium">{order.shipping_address.label}</span>}
                                        <span className="block">{order.shipping_address.line1}</span>
                                        <span className="block">{order.shipping_address.city}, {order.shipping_address.country}</span>
                                        <span className="block">{order.shipping_address.phone}</span>
                                    </>
                                ) : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Bank Transfer Instructions */}
                {order.payment_method === 'bank_transfer' && order.payment_status === 'pending' && (
                    <div className="mt-8 rounded-md bg-yellow-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Bank Transfer Instructions</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>Please transfer the total amount to the following bank account:</p>
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>Bank: Example Bank</li>
                                        <li>Account Name: Computer World</li>
                                        <li>Account Number: 1234567890</li>
                                        <li>Reference: {order.order_number}</li>
                                    </ul>
                                    <p className="mt-2">Your order will be processed once payment is confirmed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="mt-10">
                    <h2 className="text-lg font-medium text-gray-900">Items</h2>
                    <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {order.items?.map((item: OrderItem) => (
                            <div key={item.id} className="flex py-6 sm:py-10">
                                <div className="shrink-0">
                                    <img
                                        src={item.product?.images?.[0]?.storage_path
                                            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.product.images[0].storage_path}`
                                            : 'https://placehold.co/100x100?text=No+Image'}
                                        alt={item.product?.title || 'Product'}
                                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                                    />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <Link href={`/product/${item.product?.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                                                        {item.product?.title}
                                                    </Link>
                                                </h3>
                                            </div>
                                            <div className="mt-1 flex text-sm">
                                                <p className="text-gray-500">{item.variant?.title}</p>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-gray-900">${item.price}</p>
                                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
