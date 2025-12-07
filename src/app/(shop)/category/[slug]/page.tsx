import { getCategoryBySlug, getProductsByCategory, getBrands } from '@/lib/db/products'
import { ProductCard } from '@/components/shop/ProductCard'
import { notFound } from 'next/navigation'

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ brand?: string, min?: string, max?: string }>
}) {
    const { slug } = await params
    const { brand, min, max } = await searchParams

    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const products = await getProductsByCategory(category.id, {
        brandId: brand,
        minPrice: min ? Number(min) : undefined,
        maxPrice: max ? Number(max) : undefined
    })

    const brands = await getBrands()

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category.name}</h1>
                </div>

                <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                    {/* Filters */}
                    <aside>
                        <h2 className="sr-only">Filters</h2>

                        <div className="hidden lg:block">
                            <h3 className="text-sm font-medium text-gray-900 border-b pb-2 mb-4">Brands</h3>
                            <ul className="space-y-3 pb-6 text-sm font-medium text-gray-900">
                                <li>
                                    <a href={`/category/${slug}`} className={!brand ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"}>
                                        All Brands
                                    </a>
                                </li>
                                {brands.map((b) => (
                                    <li key={b.id}>
                                        <a href={`/category/${slug}?brand=${b.id}`} className={brand === b.id ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"}>
                                            {b.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product grid */}
                    <div className="lg:col-span-2 xl:col-span-3">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No products found in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
