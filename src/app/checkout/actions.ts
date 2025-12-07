'use server'

import { createOrder } from '@/lib/db/orders'
import { createAddress } from '@/lib/db/addresses'
import { getCartWithItems } from '@/lib/db/cart'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function placeOrderAction(formData: FormData) {
    const { user, profile } = await getCurrentUserAndProfile()
    if (!user || !profile) {
        return { error: 'Unauthorized' }
    }

    const addressId = formData.get('addressId') as string
    const paymentMethod = formData.get('paymentMethod') as 'cod' | 'bank_transfer'

    // New Address fields
    const newAddressLine1 = formData.get('line1') as string
    const newAddressCity = formData.get('city') as string
    const newAddressLabel = formData.get('label') as string
    const newAddressPhone = formData.get('phone') as string

    let finalAddressId = addressId

    // If "new" address selected (or no address ID provided but fields are), create it
    if (addressId === 'new') {
        if (!newAddressLine1 || !newAddressCity) {
            return { error: 'Please fill in all required address fields.' }
        }
        try {
            const newAddr = await createAddress(profile.id, {
                label: newAddressLabel || 'Home',
                full_name: profile.name || user.email, // Fallback
                phone: newAddressPhone,
                line1: newAddressLine1,
                line2: null,
                city: newAddressCity,
                province: null,
                postal_code: null,
                country: 'Pakistan',
                is_default: false // Logic to make default if first one?
            })
            finalAddressId = newAddr.id
        } catch (e) {
            console.error(e)
            return { error: 'Failed to save address.' }
        }
    }

    if (!finalAddressId) {
        return { error: 'No address selected.' }
    }

    // Get Cart
    const cart = await getCartWithItems(profile.id)
    if (!cart || !cart.items || cart.items.length === 0) {
        return { error: 'Cart is empty.' }
    }

    try {
        const order = await createOrder(profile.id, cart.items, finalAddressId, paymentMethod)
        revalidatePath('/account/orders')
        return { success: true, orderId: order.id }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to place order.' }
    }
}
