'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadFileToS3 } from '@/lib/s3'

// --- Products ---

export async function createProductAction(formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const categoryId = formData.get('categoryId') as string
    const brandId = formData.get('brandId') as string
    const basePrice = parseFloat(formData.get('basePrice') as string)
    const active = formData.get('active') === 'on'
    const imageFile = formData.get('image') as File | null

    if (!title || !slug || !categoryId || !brandId || isNaN(basePrice)) {
        return { error: 'Missing required fields' }
    }

    const supabase = await createClient()

    // 1. Create Product
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
            title,
            slug,
            category_id: categoryId,
            brand_id: brandId,
            base_price: basePrice,
            active,
            description: ''
        })
        .select()
        .single()

    if (productError) {
        console.error('Create product error:', productError)
        return { error: 'Failed to create product' }
    }

    // 2. Upload Image (if provided)
    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const fileName = `products/${product.id}/${Date.now()}-${imageFile.name}`
            const s3Key = await uploadFileToS3(buffer, fileName, imageFile.type)

            // Construct full URL (assuming public bucket or using a helper to generate signed URL later)
            // For now, we store the S3 Key or full URL. The schema says 'storage_path'.
            // Let's store the full URL if possible, or just the key. 
            // The user said "its url ehre". 
            // Assuming the bucket is public or we serve via a proxy. 
            // Let's store the key for now, as that's safer, but the user asked for URL.
            // Let's store the full S3 URL: https://{bucket}.s3.{region}.amazonaws.com/{key}
            const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`

            const { error: imageError } = await supabase
                .from('product_images')
                .insert({
                    product_id: product.id,
                    storage_path: s3Url, // Storing full URL as requested
                    position: 0,
                    alt_text: title
                })

            if (imageError) {
                console.error('Failed to save image record:', imageError)
                // We don't fail the whole request, but we should log it
            }

        } catch (uploadError: any) {
            console.error('Image upload failed:', uploadError)
            return { error: `Image upload failed: ${uploadError.message || 'Unknown error'}` }
        }
    }

    revalidatePath('/admin/products')
    redirect(`/admin/products`)
}

export async function deleteProductAction(id: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
        console.error('Delete product error:', error)
        return { error: 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
}

// --- Categories ---

export async function createCategoryAction(formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const parentId = formData.get('parentId') as string || null

    if (!name || !slug) return { error: 'Name and Slug are required' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('categories')
        .insert({ name, slug, parent_id: parentId })

    if (error) {
        console.error('Create category error:', error)
        return { error: 'Failed to create category' }
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategoryAction(id: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
        return { error: 'Failed to delete category' }
    }
    revalidatePath('/admin/categories')
}

// --- Brands ---

export async function createBrandAction(formData: FormData) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string

    if (!name || !slug) return { error: 'Name and Slug are required' }

    const supabase = await createClient()
    const { error } = await supabase
        .from('brands')
        .insert({ name, slug })

    if (error) {
        console.error('Create brand error:', error)
        return { error: 'Failed to create brand' }
    }

    revalidatePath('/admin/brands')
    redirect('/admin/brands')
}

export async function deleteBrandAction(id: string) {
    const { profile } = await getCurrentUserAndProfile()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const supabase = await createClient()
    const { error } = await supabase.from('brands').delete().eq('id', id)

    if (error) {
        return { error: 'Failed to delete brand' }
    }
    revalidatePath('/admin/brands')
}
