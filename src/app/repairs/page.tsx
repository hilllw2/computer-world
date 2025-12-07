import RepairForm from '@/components/repairs/RepairForm'

export default function RepairsPage() {
    return (
        <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
            <div className="relative max-w-xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Repair Services</h2>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Expert repair services for all your computer hardware. Fill out the form below to schedule a repair.
                    </p>
                </div>
                <div className="mt-12">
                    <RepairForm />
                </div>
            </div>
        </div>
    )
}
