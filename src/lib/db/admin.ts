import { createClient } from '@/lib/supabase/server'

export async function getAdminStats() {
    const supabase = await createClient()

    // Total Orders
    const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    // Pending Orders
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // Today's Orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    // Total Revenue
    // Note: sum() is not directly supported in simple select without rpc or client-side calc if large data.
    // For now, let's just fetch all orders and sum in JS (not scalable but fine for MVP) or use a view later.
    // Or just skip revenue for now to keep it fast.

    return {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        todayOrders: todayOrders || 0
    }
}
