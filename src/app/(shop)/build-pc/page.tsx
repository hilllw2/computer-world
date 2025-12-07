import { getCategories, getProductsByCategory, Product } from '@/lib/db/products'
import PCBuilder from '@/components/shop/PCBuilder'

// Define the categories we need for the builder
const BUILDER_CATEGORIES = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case']

export default async function BuildPCPage() {
    const allCategories = await getCategories()

    // Filter only relevant categories
    const builderCategories = allCategories.filter(c => BUILDER_CATEGORIES.includes(c.slug))

    // Fetch products for each category
    const productsByCategory: Record<string, Product[]> = {}

    for (const slug of BUILDER_CATEGORIES) {
        const category = builderCategories.find(c => c.slug === slug)
        if (category) {
            productsByCategory[slug] = await getProductsByCategory(category.id)
        } else {
            productsByCategory[slug] = []
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Custom PC Builder</h1>
                    <p className="mt-4 text-lg text-gray-500">Select your components and build your dream machine.</p>
                </div>

                <PCBuilder categories={builderCategories} productsByCategory={productsByCategory} />
            </div>
        </div>
    )
}
