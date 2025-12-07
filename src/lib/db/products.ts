import { createClient } from '@/lib/supabase/server'

export type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    parent_id: string | null
    active: boolean
}

export type Brand = {
    id: string
    name: string
    slug: string
    logo_storage_path: string | null
}

export type Product = {
    id: string
    sku: string | null
    title: string
    slug: string
    short_description: string | null
    description: string | null
    category_id: string | null
    brand_id: string | null
    base_price: number
    active: boolean
    is_configurable: boolean
    tags: string[] | null
    created_at: string
    category?: Category
    brand?: Brand
    images?: ProductImage[]
    variants?: ProductVariant[]
}

export type ProductVariant = {
    id: string
    product_id: string
    sku: string | null
    title: string | null
    price: number
    stock: number
    attributes: Record<string, any> | null
    active: boolean
}

export type ProductImage = {
    id: string
    product_id: string
    variant_id: string | null
    storage_path: string
    alt_text: string | null
    position: number
}

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name')

    if (error) console.error('Error fetching categories:', error)
    return data || []
}

export async function getFeaturedProducts(limit = 4) {
    const supabase = await createClient()
    // For now, just get the latest active products
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*), images:product_images(*)')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) console.error('Error fetching featured products:', error)
    return data || []
}

export async function getCategoryBySlug(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) return null
    return data as Category
}

export async function getProductsByCategory(
    categoryId: string,
    options: {
        brandId?: string,
        minPrice?: number,
        maxPrice?: number
    } = {}
) {
    const supabase = await createClient()
    let query = supabase
        .from('products')
        .select('*, brand:brands(*), images:product_images(*)')
        .eq('category_id', categoryId)
        .eq('active', true)

    if (options.brandId) {
        query = query.eq('brand_id', options.brandId)
    }
    if (options.minPrice !== undefined) {
        query = query.gte('base_price', options.minPrice)
    }
    if (options.maxPrice !== undefined) {
        query = query.lte('base_price', options.maxPrice)
    }

    const { data, error } = await query

    if (error) console.error('Error fetching products by category:', error)
    return data || []
}

export async function getProductBySlug(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
        .eq('slug', slug)
        .single()

    if (error) return null
    return data
}

export async function getBrands() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('active', true)
        .order('name')

    if (error) console.error('Error fetching brands:', error)
    return data || []
}
