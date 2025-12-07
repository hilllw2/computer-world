import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminTicketReplyForm from '@/components/admin/tickets/AdminTicketReplyForm'
import { clsx } from 'clsx'

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: ticket } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single()

    if (!ticket) notFound()

    const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true })

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            #{ticket.ticket_number} - {ticket.subject}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            From: {ticket.email}
                        </p>
                    </div>
                    <span className={clsx(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize",
                        ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                    )}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
                <ul role="list" className="space-y-6">
                    {messages?.map((msg) => (
                        <li key={msg.id} className={clsx(
                            "flex",
                            msg.sender_role === 'customer' ? "justify-start" : "justify-end"
                        )}>
                            <div className={clsx(
                                "max-w-lg rounded-lg px-4 py-3 shadow-sm",
                                msg.sender_role === 'customer'
                                    ? "bg-gray-100 text-gray-900"
                                    : "bg-blue-600 text-white"
                            )}>
                                <div className="text-sm">{msg.message}</div>
                                <div className={clsx(
                                    "mt-1 text-xs",
                                    msg.sender_role === 'customer' ? "text-gray-500" : "text-blue-200"
                                )}>
                                    {msg.sender_role === 'customer' ? 'Customer' : 'Support'} • {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Reply as Support</h4>
                    <AdminTicketReplyForm ticketId={ticket.id} />
                </div>
            </div>
        </div>
    )
}
