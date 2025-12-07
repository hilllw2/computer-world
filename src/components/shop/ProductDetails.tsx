'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Product, ProductVariant } from '@/lib/db/products'
import { ShoppingCart, Check } from 'lucide-react'
import { clsx } from 'clsx'

export default function ProductDetails({ product }: { product: Product }) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants && product.variants.length > 0 ? product.variants[0] : null
    )
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const currentPrice = selectedVariant ? selectedVariant.price : product.base_price
    const currentStock = selectedVariant ? selectedVariant.stock : 0

    const images = product.images || []
    const getImageUrl = (path: string) => {
        if (path.startsWith('http')) return path
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
    }

    const displayImage = images[selectedImageIndex]?.storage_path
        ? getImageUrl(images[selectedImageIndex].storage_path)
        : 'https://placehold.co/600x600?text=No+Image'

    const addToCart = async () => {
        if (!selectedVariant) return

        try {
            const { addToCartAction } = await import('@/app/cart/actions')
            const result = await addToCartAction(selectedVariant.id, 1)

            if (result?.error === 'unauthorized') {
                window.location.href = `/auth/login?redirect=/product/${product.slug}`
                return
            }

            if (result?.success) {
                alert(`Added ${product.title} to cart!`)
            } else {
                alert('Failed to add to cart')
            }
        } catch (e) {
            console.error(e)
            alert('An error occurred')
        }
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    {/* Image Gallery */}
                    <div className="flex flex-col">
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                            <Image
                                src={displayImage}
                                alt={product.title}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={clsx(
                                            "aspect-square rounded-md overflow-hidden border-2 relative",
                                            selectedImageIndex === idx ? "border-blue-600" : "border-transparent"
                                        )}
                                    >
                                        <Image
                                            src={getImageUrl(img.storage_path)}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 25vw, 10vw"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">${currentPrice}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                        </div>

                        <div className="mt-6">
                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Options</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                                        {product.variants.map((variant) => (
                                            <div
                                                key={variant.id}
                                                className={clsx(
                                                    "relative block cursor-pointer rounded-lg border p-4 focus:outline-none",
                                                    selectedVariant?.id === variant.id
                                                        ? "border-blue-600 ring-2 ring-blue-600"
                                                        : "border-gray-300"
                                                )}
                                                onClick={() => setSelectedVariant(variant)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {variant.title}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">${variant.price}</div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                                                </div>
                                                {selectedVariant?.id === variant.id && (
                                                    <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1 text-white">
                                                        <Check size={12} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 flex">
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    disabled={selectedVariant ? selectedVariant.stock <= 0 : false} // simplistic check
                                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to cart
                                </button>
                            </div>
                        </div>

                        {/* Specs */}
                        {/* If we had specs in the type, we would map them here. 
                The type definition I made earlier has `specs?: ProductSpec[]` but I didn't define ProductSpec in the client component file yet.
                Let's assume it's passed in `product` object if I update the type.
            */}
                    </div>
                </div>
            </div>
        </div>
    )
}
