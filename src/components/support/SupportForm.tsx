'use client'

import { createTicketAction } from '@/app/support/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type SupportFormProps = {
    initialEmail?: string
    orders?: { id: string, order_number: string }[]
}

export default function SupportForm({ initialEmail, orders }: SupportFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const result = await createTicketAction(formData)

        setLoading(false)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(`Ticket created successfully! Your ticket number is ${result.ticketNumber}. Please save this for your reference.`)
            // Reset form?
        }
        // If redirect happened, we won't get here usually
    }

    if (success) {
        return (
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Success</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>{success}</p>
                        </div>
                        <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                >
                                    Create another ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        defaultValue={initialEmail}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
            </div>

            {orders && orders.length > 0 && (
                <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                        Related Order (Optional)
                    </label>
                    <div className="mt-1">
                        <select
                            id="orderId"
                            name="orderId"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="">None</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.id}>
                                    Order #{order.order_number}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <div className="mt-1">
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Ticket'}
                </button>
            </div>
        </form>
    )
}
