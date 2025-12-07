'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { uploadFileToS3, deleteFileFromS3 } from '@/lib/s3'

// --- Product ---

export async function updateProductAction(productId: string, formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const basePrice = parseFloat(formData.get('basePrice') as string)
    const active = formData.get('active') === 'on'

    const supabase = await createClient()
    const { error } = await supabase
        .from('products')
        .update({ title, slug, description, base_price: basePrice, active })
        .eq('id', productId)

    if (error) return { error: 'Failed to update product' }

    revalidatePath(`/admin/products/${productId}`)
    return { success: true }
}

// --- Variants ---

export async function createVariantAction(productId: string, formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const sku = formData.get('sku') as string

    const supabase = await createClient()
    const { error } = await supabase
        .from('product_variants')
        .insert({ product_id: productId, title, price, stock, sku })

    if (error) return { error: 'Failed to create variant' }

    revalidatePath(`/admin/products/${productId}`)
    return { success: true }
}

export async function deleteVariantAction(variantId: string, productId: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId)

    if (error) return { error: 'Failed to delete variant' }

    revalidatePath(`/admin/products/${productId}`)
    return { success: true }
}

// --- Images ---

export async function uploadImageAction(productId: string, formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const file = formData.get('file') as File
    if (!file) return { error: 'No file uploaded' }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `products/${productId}/${Date.now()}-${file.name}`

    try {
        await uploadFileToS3(buffer, fileName, file.type)

        const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

        const supabase = await createClient()
        const { error } = await supabase
            .from('product_images')
            .insert({
                product_id: productId,
                storage_path: s3Url,
                position: 0 // Default to 0, can implement reordering later
            })

        if (error) throw error

        revalidatePath(`/admin/products/${productId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to upload image' }
    }
}

export async function deleteImageAction(imageId: string, storagePath: string, productId: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    try {
        await deleteFileFromS3(storagePath)

        const supabase = await createClient()
        const { error } = await supabase
            .from('product_images')
            .delete()
            .eq('id', imageId)

        if (error) throw error

        revalidatePath(`/admin/products/${productId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to delete image' }
    }
}
