'use client'

import { deleteProductAction } from '@/app/admin/actions'
import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteProductButton({ id, title }: { id: string, title: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return

        setLoading(true)
        const result = await deleteProductAction(id)
        setLoading(false)

        if (result?.error) {
            alert(result.error)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete, {title}</span>
        </button>
    )
}
