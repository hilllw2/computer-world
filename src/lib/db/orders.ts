import { createClient } from '@/lib/supabase/server'
import { CartItemWithDetails } from './cart'

export type Order = {
    id: string
    order_number: string
    profile_id: string
    shipping_address_id: string
    billing_address_id: string
    status: 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
    payment_method: 'cod' | 'bank_transfer'
    payment_status: 'pending' | 'initiated' | 'paid' | 'failed' | 'refunded'
    total_amount: number
    shipping_cost: number
    discount_amount: number
    tax_amount: number
    estimated_delivery_date: string | null
    created_at: string
    items?: OrderItem[]
    shipping_address?: any // Type this properly if needed
}

export type OrderItem = {
    id: string
    order_id: string
    product_id: string
    variant_id: string
    quantity: number
    price: number
    line_total: number
    product?: {
        title: string
        slug: string
        images: { storage_path: string }[]
    }
    variant?: {
        title: string
    }
}

function generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export async function createOrder(
    profileId: string,
    cartItems: CartItemWithDetails[],
    addressId: string,
    paymentMethod: 'cod' | 'bank_transfer'
) {
    const supabase = await createClient()

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0)
    const shippingCost = 0 // Flat rate or calc logic here
    const taxAmount = 0 // Tax logic here
    const totalAmount = subtotal + shippingCost + taxAmount

    // Start a transaction (Supabase doesn't support explicit transactions in client lib easily without RPC, 
    // but we can do sequential inserts. If one fails, we might have partial data. 
    // Ideally use an RPC function for atomicity. For now, sequential.)

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: generateOrderNumber(),
            profile_id: profileId,
            shipping_address_id: addressId,
            billing_address_id: addressId, // Assuming same for now
            status: 'pending',
            payment_method: paymentMethod,
            payment_status: 'pending',
            total_amount: totalAmount,
            shipping_cost: shippingCost,
            tax_amount: taxAmount
        })
        .select()
        .single()

    if (orderError) throw orderError

    // 2. Create Order Items
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.variant.product.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price: item.variant.price,
        line_total: item.variant.price * item.quantity
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        // Rollback order if possible or log critical error
        console.error('Error creating order items:', itemsError)
        // In a real app, we'd want to delete the order here to clean up
        await supabase.from('orders').delete().eq('id', order.id)
        throw itemsError
    }

    // 3. Clear Cart
    // We need the cart_id. Assuming all items are from same cart.
    if (cartItems.length > 0) {
        const cartId = cartItems[0].cart_id
        await supabase.from('cart_items').delete().eq('cart_id', cartId)
    }

    return order
}

export async function getOrder(orderId: string) {
    const supabase = await createClient()

    const { data: order, error } = await supabase
        .from('orders')
        .select(`
      *,
      shipping_address:addresses(*),
      items:order_items(
        *,
        product:products(title, slug, images:product_images(storage_path)),
        variant:product_variants(title)
      )
    `)
        .eq('id', orderId)
        .single()

    if (error) return null
    return order
}

export async function getOrdersList(profileId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching orders list:', error)
        return []
    }
    return data
}
