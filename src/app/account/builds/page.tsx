import { getCurrentUserAndProfile } from '@/lib/auth'
import { getBuilds } from '@/lib/db/builds'

export default async function BuildsPage() {
    const { profile } = await getCurrentUserAndProfile()
    const builds = await getBuilds(profile!.id)

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">My PC Builds</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {builds.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No saved builds yet.</li>
                    ) : (
                        builds.map((build) => (
                            <li key={build.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">{build.title || 'Untitled Build'}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                                            {build.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Last updated <time dateTime={build.updated_at} className="ml-1">{new Date(build.updated_at).toLocaleDateString()}</time>
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>Est. Price: ${build.total_price}</p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
