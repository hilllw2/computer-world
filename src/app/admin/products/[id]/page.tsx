import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductGeneralForm from '@/components/admin/products/ProductGeneralForm'
import ProductVariantsManager from '@/components/admin/products/ProductVariantsManager'
import ProductImagesManager from '@/components/admin/products/ProductImagesManager'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) notFound()

    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('created_at')

    const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order')

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Product: {product.title}</h1>
            </div>

            <ProductGeneralForm product={product} />
            <ProductVariantsManager productId={product.id} variants={variants || []} />
            <ProductImagesManager productId={product.id} images={images || []} />
        </div>
    )
}
