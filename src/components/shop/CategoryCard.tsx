import Link from 'next/link'
import { Category } from '@/lib/db/products'

export function CategoryCard({ category }: { category: Category }) {
    return (
        <Link href={`/category/${category.slug}`} className="group relative flex h-40 w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-blue-500 transition-colors">
            <div className="flex-1 p-6 flex items-center justify-center">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                </h3>
            </div>
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                Browse Products &rarr;
            </div>
        </Link>
    )
}
