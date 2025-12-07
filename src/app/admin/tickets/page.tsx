import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminTicketsPage() {
    const supabase = await createClient()
    const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .order('updated_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {tickets?.map((ticket) => (
                        <li key={ticket.id}>
                            <Link href={`/admin/tickets/${ticket.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
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
                                                {ticket.email}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Last updated <time dateTime={ticket.updated_at}>{new Date(ticket.updated_at).toLocaleDateString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
