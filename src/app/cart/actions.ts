'use server'

import { addItemToCart, updateCartItemQuantity, removeCartItem } from '@/lib/db/cart'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addToCartAction(variantId: string, quantity: number) {
    const { user } = await getCurrentUserAndProfile()

    if (!user) {
        // We can't easily redirect from a server action called by a client component event handler 
        // without the client handling it, but we can throw an error or return a status.
        // For now, let's return a specific object.
        return { error: 'unauthorized' }
    }

    try {
        await addItemToCart(user.id, variantId, quantity)
        revalidatePath('/cart')
        return { success: true }
    } catch (error) {
        console.error('Add to cart error:', error)
        return { error: 'failed' }
    }
}

export async function updateQuantityAction(cartItemId: string, quantity: number) {
    const { user } = await getCurrentUserAndProfile()
    if (!user) return { error: 'unauthorized' }

    try {
        await updateCartItemQuantity(cartItemId, quantity)
        revalidatePath('/cart')
        return { success: true }
    } catch (error) {
        return { error: 'failed' }
    }
}

export async function removeItemAction(cartItemId: string) {
    const { user } = await getCurrentUserAndProfile()
    if (!user) return { error: 'unauthorized' }

    try {
        await removeCartItem(cartItemId)
        revalidatePath('/cart')
        return { success: true }
    } catch (error) {
        return { error: 'failed' }
    }
}
