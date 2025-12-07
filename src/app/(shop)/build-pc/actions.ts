'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { addItemToCart } from '@/lib/db/cart'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveBuildAction(title: string, selectedVariants: Record<string, string>) {
    const { user, profile } = await getCurrentUserAndProfile()

    if (!user || !profile) {
        return { error: 'unauthorized' }
    }

    const supabase = await createClient()

    // Calculate total price (fetching fresh prices to be safe)
    // We need to fetch the variants to get prices.
    const variantIds = Object.values(selectedVariants)
    if (variantIds.length === 0) {
        return { error: 'No components selected' }
    }

    const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select('id, price')
        .in('id', variantIds)

    if (variantsError || !variants) {
        return { error: 'Failed to fetch component prices' }
    }

    const totalPrice = variants.reduce((sum, v) => sum + v.price, 0)

    // 1. Create Build
    const { data: build, error: buildError } = await supabase
        .from('custom_builds')
        .insert({
            profile_id: profile.id,
            title: title || 'My Custom PC',
            status: 'draft',
            total_price: totalPrice
        })
        .select()
        .single()

    if (buildError) {
        console.error('Build creation error:', buildError)
        return { error: 'Failed to create build' }
    }

    // 2. Add Components
    const componentsToAdd = variants.map(v => ({
        build_id: build.id,
        variant_id: v.id,
        price_snapshot: v.price,
        qty: 1 // Assuming 1 of each for now, though RAM/Storage might be multiple in future
    }))

    const { error: componentsError } = await supabase
        .from('custom_build_components')
        .insert(componentsToAdd)

    if (componentsError) {
        console.error('Build components error:', componentsError)
        return { error: 'Failed to add components to build' }
    }

    revalidatePath('/account/builds')
    return { success: true, buildId: build.id }
}

export async function addBuildToCartAction(buildId: string) {
    const { user, profile } = await getCurrentUserAndProfile()
    if (!user || !profile) return { error: 'unauthorized' }

    const supabase = await createClient()

    // Fetch build components
    const { data: components, error } = await supabase
        .from('custom_build_components')
        .select('variant_id, qty')
        .eq('build_id', buildId)

    if (error || !components) {
        return { error: 'Failed to fetch build components' }
    }

    try {
        // Add each to cart
        // We could optimize this to be parallel or batch if `addItemToCart` supported it, 
        // but sequential is fine for MVP.
        for (const comp of components) {
            if (comp.variant_id) {
                await addItemToCart(profile.id, comp.variant_id, comp.qty || 1)
            }
        }
        revalidatePath('/cart')
        return { success: true }
    } catch (e) {
        console.error('Add build to cart error:', e)
        return { error: 'Failed to add items to cart' }
    }
}
