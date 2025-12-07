import { getCurrentUserAndProfile } from '@/lib/auth'
import { getAddresses } from '@/lib/db/addresses'
import AddressList from '@/components/account/AddressList'

export default async function AddressesPage() {
    const { profile } = await getCurrentUserAndProfile()
    const addresses = await getAddresses(profile!.id)

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Addresses</h1>
            <AddressList addresses={addresses} />
        </div>
    )
}
