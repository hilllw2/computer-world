'use client'

import Image from 'next/image'
import { uploadImageAction, deleteImageAction } from '@/app/admin/products/[id]/actions'
import { useState } from 'react'
import { Loader2, Trash2, Upload } from 'lucide-react'

export default function ProductImagesManager({ productId, images }: { productId: string, images: any[] }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async (imageId: string, storagePath: string) => {
        if (!confirm('Are you sure?')) return
        await deleteImageAction(imageId, storagePath, productId)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', e.target.files[0])

        await uploadImageAction(productId, formData)
        setLoading(false)

        // Reset input
        e.target.value = ''
    }

    const getImageUrl = (path: string) => {
        if (path.startsWith('http')) return path
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
    }

    return (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Images</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload product images.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {images.map((img) => (
                            <div key={img.id} className="relative group aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={getImageUrl(img.storage_path)}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <button
                                    onClick={() => handleDelete(img.id, img.storage_path)}
                                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                            {loading ? (
                                <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <span className="mt-2 text-xs text-gray-500">Upload</span>
                                </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
