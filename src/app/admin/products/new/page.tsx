import { getCategories, Brand } from '@/lib/db/products'
import { createClient } from '@/lib/supabase/server'
import CreateProductForm from '@/components/admin/products/CreateProductForm'

export default async function NewProductPage() {
    const categories = await getCategories()
    const supabase = await createClient()
    const { data: brands } = await supabase.from('brands').select('*').order('name')

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
            <CreateProductForm categories={categories} brands={(brands as Brand[]) || []} />
        </div>
    )
}
