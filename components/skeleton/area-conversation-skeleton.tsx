import { Skeleton } from "../ui/skeleton"

const AreaConversationSkeleton = () => {
    return (
        <>
            <div className="flex flex-1 overflow-scroll w-full">
                <div className="flex flex-col gap-4 overflow-scroll py-8 w-full">
                    <div className="flex gap-3 items-start">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[100px] h-4 rounded-md" />

                            <Skeleton className="w-[140px] h-[50px] rounded-md" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-start justify-end">
                        <div className="flex flex-col gap-2 items-end">
                            <Skeleton className="w-[100px] h-4 rounded-md" />

                            <Skeleton className="w-[240px] h-[70px] rounded-md" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-start justify-end">
                        <div className="flex flex-col gap-2 items-end">
                            <Skeleton className="w-[100px] h-4 rounded-md" />

                            <Skeleton className="w-[240px] h-[100px] rounded-md" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[70px] h-4 rounded-md" />

                            <Skeleton className="w-[240px] h-[50px] rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AreaConversationSkeleton
