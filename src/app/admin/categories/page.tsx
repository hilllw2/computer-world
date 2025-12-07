import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2 } from 'lucide-react'
import { deleteCategoryAction } from '@/app/admin/actions'

export default async function AdminCategoriesPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Category
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {categories?.map((category) => (
                        <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                <p className="text-sm text-gray-500">/{category.slug}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <form action={deleteCategoryAction.bind(null, category.id)}>
                                    <button type="submit" className="text-red-600 hover:text-red-900">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </li>
                    ))}
                    {categories?.length === 0 && (
                        <li className="px-6 py-4 text-center text-gray-500">No categories found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
