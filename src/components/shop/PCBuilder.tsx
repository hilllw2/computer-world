'use client'

import { useState } from 'react'
import { Category, Product } from '@/lib/db/products'
import { saveBuildAction, addBuildToCartAction } from '@/app/(shop)/build-pc/actions'
import { Loader2, Check, Plus, Save, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

type PCBuilderProps = {
    categories: Category[]
    productsByCategory: Record<string, Product[]>
}

// Define the order of steps
const STEPS = [
    { slug: 'cpu', label: 'Processor (CPU)' },
    { slug: 'motherboard', label: 'Motherboard' },
    { slug: 'ram', label: 'Memory (RAM)' },
    { slug: 'gpu', label: 'Graphics Card' },
    { slug: 'storage', label: 'Storage' },
    { slug: 'psu', label: 'Power Supply' },
    { slug: 'case', label: 'Case' },
]

export default function PCBuilder({ categories, productsByCategory }: PCBuilderProps) {
    const [selections, setSelections] = useState<Record<string, Product | null>>({})
    const [buildTitle, setBuildTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Calculate total
    const totalPrice = Object.values(selections).reduce((sum, product) => {
        // Use base price or first variant price
        const price = product?.variants?.[0]?.price ?? product?.base_price ?? 0
        return sum + price
    }, 0)

    const handleSelect = (categorySlug: string, product: Product) => {
        setSelections(prev => ({
            ...prev,
            [categorySlug]: product
        }))
    }

    const handleSave = async (addToCart: boolean = false) => {
        setLoading(true)

        // Convert selections to map of category -> variant_id
        // For MVP, assuming we pick the first variant if multiple exist, or we need a variant picker.
        // Let's assume the product card in builder picks the first variant automatically for simplicity.
        const selectedVariants: Record<string, string> = {}

        for (const [slug, product] of Object.entries(selections)) {
            if (product) {
                // Prefer variant if exists, else fail? Schema requires variant_id for cart/builds usually?
                // The schema `custom_build_components` has `variant_id`.
                // So we MUST have a variant.
                const variantId = product.variants?.[0]?.id
                if (variantId) {
                    selectedVariants[slug] = variantId
                }
            }
        }

        const result = await saveBuildAction(buildTitle, selectedVariants)

        if (result.error === 'unauthorized') {
            router.push('/auth/login?redirect=/build-pc')
            return
        }

        if (result.success && result.buildId) {
            if (addToCart) {
                await addBuildToCartAction(result.buildId)
                router.push('/cart')
            } else {
                router.push('/account/builds')
            }
        } else {
            alert('Failed to save build')
            setLoading(false)
        }
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            {/* Main Builder Area */}
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <label htmlFor="build-title" className="block text-sm font-medium text-gray-700">Build Name</label>
                    <input
                        type="text"
                        id="build-title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        placeholder="My Awesome Gaming PC"
                        value={buildTitle}
                        onChange={(e) => setBuildTitle(e.target.value)}
                    />
                </div>

                {STEPS.map((step) => {
                    const category = categories.find(c => c.slug === step.slug)
                    const products = productsByCategory[step.slug] || []
                    const selected = selections[step.slug]

                    return (
                        <div key={step.slug} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">{step.label}</h3>
                                {selected && (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                        Selected
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                {selected ? (
                                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                                <img
                                                    src={selected.images?.[0]?.storage_path
                                                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${selected.images[0].storage_path}`
                                                        : 'https://placehold.co/100x100?text=No+Image'}
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-sm font-medium text-gray-900">{selected.title}</h4>
                                                <p className="text-sm text-gray-500">${selected.variants?.[0]?.price ?? selected.base_price}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelect(step.slug, null as any)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {products.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No products available in this category.</p>
                                        ) : (
                                            products.map(product => (
                                                <div
                                                    key={product.id}
                                                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm hover:border-gray-400 cursor-pointer"
                                                    onClick={() => handleSelect(step.slug, product)}
                                                >
                                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={product.images?.[0]?.storage_path
                                                                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${product.images[0].storage_path}`
                                                                : 'https://placehold.co/100x100?text=No+Image'}
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="absolute inset-0" aria-hidden="true" />
                                                        <p className="text-sm font-medium text-gray-900">{product.title}</p>
                                                        <p className="truncate text-sm text-gray-500">${product.variants?.[0]?.price ?? product.base_price}</p>
                                                    </div>
                                                    <Plus className="h-5 w-5 text-gray-400" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="sticky top-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Build Summary</h2>

                    <dl className="space-y-4">
                        {STEPS.map(step => {
                            const selected = selections[step.slug]
                            if (!selected) return null
                            return (
                                <div key={step.slug} className="flex justify-between text-sm">
                                    <dt className="text-gray-500">{step.label}</dt>
                                    <dd className="font-medium text-gray-900">${selected.variants?.[0]?.price ?? selected.base_price}</dd>
                                </div>
                            )
                        })}

                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <dt className="text-base font-medium text-gray-900">Total</dt>
                            <dd className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</dd>
                        </div>
                    </dl>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={() => handleSave(false)}
                            disabled={loading || Object.keys(selections).length === 0}
                            className="w-full flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Build
                        </button>
                        <button
                            onClick={() => handleSave(true)}
                            disabled={loading || Object.keys(selections).length === 0}
                            className="w-full flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
