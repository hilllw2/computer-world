import Link from 'next/link'
import { Product } from '@/lib/db/products'
import { ShoppingCart } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
    // Use the first image or a placeholder
    const imageUrl = product.images?.[0]?.storage_path
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${product.images[0].storage_path}`
        : 'https://placehold.co/400x400?text=No+Image'

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                {product.brand && (
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {product.brand.name}
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/product/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                    </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.short_description}</p>
                <div className="mt-4 flex flex-1 items-end justify-between">
                    <p className="text-base font-medium text-gray-900">${product.base_price}</p>
                    <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingCart size={16} />
                    </div>
                </div>
            </div>
        </div>
    )
}
