import { getCurrentUserAndProfile } from '@/lib/auth'
import { getTicketWithMessages } from '@/lib/db/tickets'
import { notFound, redirect } from 'next/navigation'
import TicketReplyForm from '@/components/account/TicketReplyForm'
import { clsx } from 'clsx'

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { profile } = await getCurrentUserAndProfile()

    if (!profile) {
        redirect(`/auth/login?redirect=/account/tickets/${id}`)
    }

    const ticket = await getTicketWithMessages(id)

    if (!ticket) {
        notFound()
    }

    // Security check
    if (ticket.profile_id !== profile.id) {
        notFound()
    }

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            #{ticket.ticket_number} - {ticket.subject}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Status: <span className="capitalize font-medium text-gray-900">{ticket.status.replace('_', ' ')}</span>
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
                    {ticket.messages.map((msg) => (
                        <li key={msg.id} className={clsx(
                            "flex",
                            msg.sender_role === 'customer' ? "justify-end" : "justify-start"
                        )}>
                            <div className={clsx(
                                "max-w-lg rounded-lg px-4 py-3 shadow-sm",
                                msg.sender_role === 'customer'
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                            )}>
                                <div className="text-sm">{msg.message}</div>
                                <div className={clsx(
                                    "mt-1 text-xs",
                                    msg.sender_role === 'customer' ? "text-blue-200" : "text-gray-500"
                                )}>
                                    {msg.sender_role === 'customer' ? 'You' : 'Support'} • {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {ticket.status !== 'closed' && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900">Reply to ticket</h4>
                        <TicketReplyForm ticketId={ticket.id} />
                    </div>
                )}
            </div>
        </div>
    )
}
