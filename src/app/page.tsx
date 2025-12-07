import { getCategories, getFeaturedProducts } from '@/lib/db/products'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { ProductCard } from '@/components/shop/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const categories = await getCategories()
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Build Your Dream PC</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              The best components, custom builds, and expert support for all your computing needs.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/build-pc"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Start Building
              </Link>
              <a href="#categories" className="text-sm font-semibold leading-6 text-white">
                Browse Categories <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
