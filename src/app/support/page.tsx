import { getCurrentUserAndProfile } from '@/lib/auth'
import { getOrdersList } from '@/lib/db/orders'
import SupportForm from '@/components/support/SupportForm'

export default async function SupportPage() {
    const { user, profile } = await getCurrentUserAndProfile()

    let orders = []
    if (profile) {
        orders = await getOrdersList(profile.id) || []
    }

    return (
        <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
            <div className="relative max-w-xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Support</h2>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Have an issue with your order or need help building your PC? Submit a ticket below.
                    </p>
                </div>
                <div className="mt-12">
                    <SupportForm
                        initialEmail={user?.email || ''}
                        orders={orders.map(o => ({ id: o.id, order_number: o.order_number }))}
                    />
                </div>
            </div>
        </div>
    )
}
