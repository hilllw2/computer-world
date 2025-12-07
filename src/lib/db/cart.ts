import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type CartItemWithDetails = {
    id: string
    cart_id: string
    variant_id: string
    quantity: number
    price_snapshot: number
    variant: {
        id: string
        title: string | null
        price: number
        stock: number
        product: {
            id: string
            title: string
            slug: string
            images: {
                storage_path: string
            }[]
        }
    }
}

export async function getOrCreateCart(profileId: string) {
    const supabase = await createClient()

    // Try to find existing cart
    const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('profile_id', profileId)
        .single()

    if (cart) return cart

    // Create new cart
    const { data: newCart, error } = await supabase
        .from('carts')
        .insert({ profile_id: profileId })
        .select('id')
        .single()

    if (error) throw error
    return newCart
}

export async function getCartWithItems(profileId: string) {
    const supabase = await createClient()

    // First get the cart
    const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('profile_id', profileId)
        .single()

    if (!cart) return null

    // Then get items with deep nesting
    // Note: Supabase nested query syntax
    const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
      *,
      variant:product_variants (
        id,
        title,
        price,
        stock,
        product:products (
          id,
          title,
          slug,
          images:product_images (
            storage_path
          )
        )
      )
    `)
        .eq('cart_id', cart.id)
        .order('created_at')

    if (error) {
        console.error('Error fetching cart items:', error)
        return null
    }

    return { ...cart, items: items as unknown as CartItemWithDetails[] }
}

export async function addItemToCart(profileId: string, variantId: string, quantity: number) {
    const supabase = await createClient()
    const cart = await getOrCreateCart(profileId)

    // Get current price
    const { data: variant } = await supabase
        .from('product_variants')
        .select('price')
        .eq('id', variantId)
        .single()

    if (!variant) throw new Error('Variant not found')

    // Check if item exists
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('variant_id', variantId)
        .single()

    if (existingItem) {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({
                quantity: existingItem.quantity + quantity,
                price_snapshot: variant.price // Update price to current
            })
            .eq('id', existingItem.id)

        if (error) throw error
    } else {
        // Insert new item
        const { error } = await supabase
            .from('cart_items')
            .insert({
                cart_id: cart.id,
                variant_id: variantId,
                quantity,
                price_snapshot: variant.price
            })

        if (error) throw error
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    const supabase = await createClient()

    if (quantity <= 0) {
        return removeCartItem(cartItemId)
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

    if (error) throw error
}

export async function removeCartItem(cartItemId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

    if (error) throw error
}
