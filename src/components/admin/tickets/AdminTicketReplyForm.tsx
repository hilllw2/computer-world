'use client'

import { adminReplyToTicketAction } from '@/app/admin/tickets/actions'
import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

export default function AdminTicketReplyForm({ ticketId }: { ticketId: string }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setLoading(true)
        await adminReplyToTicketAction(ticketId, message)
        setLoading(false)
        setMessage('')
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div>
                <label htmlFor="reply" className="sr-only">Reply</label>
                <textarea
                    id="reply"
                    name="reply"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="Type your reply here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <div className="mt-3 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Send Reply
                </button>
            </div>
        </form>
    )
}
