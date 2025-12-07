import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2 } from 'lucide-react'
import { deleteBrandAction } from '@/app/admin/actions'

export default async function AdminBrandsPage() {
    const supabase = await createClient()
    const { data: brands } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
                <Link
                    href="/admin/brands/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Brand
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {brands?.map((brand) => (
                        <li key={brand.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{brand.name}</p>
                                <p className="text-sm text-gray-500">/{brand.slug}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <form action={deleteBrandAction.bind(null, brand.id)}>
                                    <button type="submit" className="text-red-600 hover:text-red-900">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </li>
                    ))}
                    {brands?.length === 0 && (
                        <li className="px-6 py-4 text-center text-gray-500">No brands found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
