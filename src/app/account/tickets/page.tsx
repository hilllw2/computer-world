import { getCurrentUserAndProfile } from '@/lib/auth'
import { getTickets } from '@/lib/db/tickets'

export default async function TicketsPage() {
    const { profile } = await getCurrentUserAndProfile()
    const tickets = await getTickets(profile!.id)

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Support Tickets</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {tickets.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No support tickets found.</li>
                    ) : (
                        tickets.map((ticket) => (
                            <li key={ticket.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">#{ticket.ticket_number} - {ticket.subject}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Created on <time dateTime={ticket.created_at} className="ml-1">{new Date(ticket.created_at).toLocaleDateString()}</time>
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p className="capitalize">Priority: {ticket.priority}</p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
