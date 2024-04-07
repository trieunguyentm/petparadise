import { Skeleton } from "../ui/skeleton"

const UserProfileSkeleton = () => {
    return (
        <>
            <div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex flex-col text-brown-1 gap-3 max-md:hidden">
                <div className="text-xl font-medium">
                    <Skeleton className="h-4 w-[90px]" />
                </div>
                <div className="text-sm">
                    <Skeleton className="h-4 w-[90px]" />
                </div>
            </div>
        </>
    )
}

export default UserProfileSkeleton
