'use client'

import { createRepairRequestAction } from '@/app/repairs/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function RepairForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        const result = await createRepairRequestAction(formData)
        setLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(true)
        }
    }

    if (success) {
        return (
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Request Received</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>We have received your repair request. Our team will contact you shortly to confirm the details.</p>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="text-sm font-medium text-green-800 hover:text-green-900"
                            >
                                Submit another request &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">Device Type</label>
                    <div className="mt-1">
                        <select id="deviceType" name="deviceType" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">Select a type</option>
                            <option value="Desktop">Desktop PC</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Printer">Printer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                    <div className="mt-1">
                        <input type="text" name="brand" id="brand" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model (Optional)</label>
                    <div className="mt-1">
                        <input type="text" name="model" id="model" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Problem Description</label>
                    <div className="mt-1">
                        <textarea id="description" name="description" rows={4} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Please describe the issue in detail..."></textarea>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Preferred Visit/Drop-off Date</label>
                    <div className="mt-1">
                        <input type="date" name="preferredDate" id="preferredDate" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
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
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Request'}
                </button>
            </div>
        </form>
    )
}
