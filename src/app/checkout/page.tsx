import { getCurrentUserAndProfile } from '@/lib/auth'
import { getAddresses } from '@/lib/db/addresses'
import { getCartWithItems } from '@/lib/db/cart'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/shop/CheckoutForm'

export default async function CheckoutPage() {
    const { user, profile } = await getCurrentUserAndProfile()

    if (!user || !profile) {
        redirect('/auth/login?redirect=/checkout')
    }

    const cart = await getCartWithItems(profile.id)

    if (!cart || !cart.items || cart.items.length === 0) {
        redirect('/cart')
    }

    const addresses = await getAddresses(profile.id)

    const subtotal = cart.items.reduce((sum, item) => {
        return sum + (item.variant.price * item.quantity)
    }, 0)

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
                <CheckoutForm addresses={addresses} subtotal={subtotal} />
            </div>
        </div>
    )
}
