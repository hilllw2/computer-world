import { getProductBySlug } from '@/lib/db/products'
import ProductDetails from '@/components/shop/ProductDetails'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    return <ProductDetails product={product} />
}
