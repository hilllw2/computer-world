import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import DeleteProductButton from '@/components/admin/products/DeleteProductButton'

export default async function AdminProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(name), brand:brands(name)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all products in your store.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/products/new"
                        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <Plus className="inline-block h-4 w-4 mr-1" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Brand</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products?.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{product.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category?.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.brand?.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.base_price}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-end space-x-2">
                                                <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                                                    Edit<span className="sr-only">, {product.title}</span>
                                                </Link>
                                                <DeleteProductButton id={product.id} title={product.title} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
