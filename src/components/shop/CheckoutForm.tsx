'use client'

import { useState } from 'react'
import { Address } from '@/lib/db/addresses'
import { placeOrderAction } from '@/app/checkout/actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CheckoutForm({ addresses, subtotal }: { addresses: Address[], subtotal: number }) {
    const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses.length > 0 ? addresses[0].id : 'new')
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)

        // Append state values to formData
        formData.set('addressId', selectedAddressId)
        formData.set('paymentMethod', paymentMethod)

        const result = await placeOrderAction(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else if (result.success && result.orderId) {
            router.push(`/account/orders/${result.orderId}`)
        }
    }

    return (
        <form action={handleSubmit} className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="shipping-heading" className="lg:col-span-7">

                {/* Address Selection */}
                <div className="border-b border-gray-200 pb-10">
                    <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">Shipping Address</h2>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${selectedAddressId === addr.id ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                                onClick={() => setSelectedAddressId(addr.id)}
                            >
                                <span className="flex flex-1">
                                    <span className="flex flex-col">
                                        <span className="block text-sm font-medium text-gray-900">{addr.label}</span>
                                        <span className="mt-1 flex items-center text-sm text-gray-500">{addr.line1}, {addr.city}</span>
                                        <span className="mt-6 text-sm font-medium text-gray-900">{addr.phone}</span>
                                    </span>
                                </span>
                                <span className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${selectedAddressId === addr.id ? 'border-blue-600' : 'border-transparent'}`} aria-hidden="true" />
                            </div>
                        ))}

                        <div
                            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${selectedAddressId === 'new' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                            onClick={() => setSelectedAddressId('new')}
                        >
                            <span className="flex flex-1">
                                <span className="flex flex-col justify-center items-center h-full w-full">
                                    <span className="block text-sm font-medium text-gray-900">+ Add New Address</span>
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* New Address Form */}
                    {selectedAddressId === 'new' && (
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 bg-gray-50 p-4 rounded-md">
                            <div className="sm:col-span-3">
                                <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label (e.g. Home)</label>
                                <div className="mt-1">
                                    <input type="text" name="label" id="label" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <div className="mt-1">
                                    <input type="text" name="phone" id="phone" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="line1" className="block text-sm font-medium text-gray-700">Address</label>
                                <div className="mt-1">
                                    <input type="text" name="line1" id="line1" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <div className="mt-1">
                                    <input type="text" name="city" id="city" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Method */}
                <div className="mt-10 border-t border-gray-200 pt-10">
                    <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div
                            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${paymentMethod === 'cod' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <span className="flex flex-1">
                                <span className="flex flex-col">
                                    <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                                    <span className="mt-1 flex items-center text-sm text-gray-500">Pay when you receive your order</span>
                                </span>
                            </span>
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'}`}>
                                {paymentMethod === 'cod' && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                            </div>
                        </div>
                        <div
                            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${paymentMethod === 'bank_transfer' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                            onClick={() => setPaymentMethod('bank_transfer')}
                        >
                            <span className="flex flex-1">
                                <span className="flex flex-col">
                                    <span className="block text-sm font-medium text-gray-900">Bank Transfer</span>
                                    <span className="mt-1 flex items-center text-sm text-gray-500">Direct deposit to our account</span>
                                </span>
                            </span>
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'border-blue-600' : 'border-gray-300'}`}>
                                {paymentMethod === 'bank_transfer' && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Order Summary */}
            <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                        <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                </dl>

                {error && (
                    <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Place Order'}
                    </button>
                </div>
            </section>
        </form>
    )
}
