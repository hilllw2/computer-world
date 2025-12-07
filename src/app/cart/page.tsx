import { getCurrentUserAndProfile } from '@/lib/auth'
import { getCartWithItems } from '@/lib/db/cart'
import { redirect } from 'next/navigation'
import { CartItemRow } from '@/components/shop/CartItemRow'
import Link from 'next/link'

export default async function CartPage() {
    const { user } = await getCurrentUserAndProfile()

    if (!user) {
        redirect('/auth/login?redirect=/cart')
    }

    const cart = await getCartWithItems(user.id)
    const items = cart?.items || []

    const subtotal = items.reduce((sum, item) => {
        return sum + (item.variant.price * item.quantity)
    }, 0)

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

                <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                        </h2>

                        {items.length === 0 ? (
                            <div className="text-center py-12 border-t border-b border-gray-200">
                                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                                <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
                                    Continue Shopping &rarr;
                                </Link>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                                {items.map((item) => (
                                    <CartItemRow key={item.id} item={item} />
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                            Order summary
                        </h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                className={`w-full block text-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}
