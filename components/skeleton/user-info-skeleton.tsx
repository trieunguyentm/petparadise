import { Skeleton } from "../ui/skeleton"

const UserInfoSkeleton = () => {
    return (
        <div className="flex flex-col">
            <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                Profile
            </div>
            <div className="flex justify-between items-center p-5">
                <Skeleton className="w-[140px] h-[140px] rounded-full" />
                <div className="flex flex-col gap-3 text-brown-1">
                    <div className="flex gap-2 items-center">
                        <Skeleton className="w-[25px] h-[25px] rounded-full" />
                        <div>
                            <Skeleton className="w-[100px] h-4" />
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Skeleton className="w-[25px] h-[25px] rounded-full" />
                        <div>
                            <Skeleton className="w-[100px] h-4" />
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Skeleton className="w-[25px] h-[25px] rounded-full" />
                        <div>
                            <Skeleton className="w-[100px] h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoSkeleton
