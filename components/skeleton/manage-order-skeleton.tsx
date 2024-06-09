import React from "react"
import { Skeleton } from "../ui/skeleton"

const ManageOrderSkeleton = () => {
    return (
        <div className="border p-2 rounded-lg text-sm flex max-md:flex-col max-md:gap-2 md:justify-between">
            <div className="flex flex-col gap-2">
                <Skeleton className="w-[80px] h-4" />
                <Skeleton className="w-[60px] h-4" />
                <Skeleton className="w-[80px] h-4" />
                <Skeleton className="w-[60px] h-4" />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mt-5">
                        <Skeleton className="w-[150px] h-[150px] border rounded-xl p-2" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[100px] h-5" />
                            <Skeleton className="w-[60px] h-4" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="w-[80px] h-4" />
                <Skeleton className="w-[80px] h-10" />
            </div>
        </div>
    )
}

export default ManageOrderSkeleton
