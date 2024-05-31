import React from "react"
import { Skeleton } from "../ui/skeleton"

const ItemCardSkeleton = () => {
    return (
        <div className="relative cursor-pointer p-4 rounded-lg shadow-lg hover:shadow-2xl">
            <div className="w-full overflow-hidden rounded-lg mb-4">
                <div className="flex transition-transform duration-500">
                    {/* Sử dụng flex-shrik-0 để đảm bảo cho các ảnh còn lại bằng 0 so với ảnh hiện tại */}
                    <Skeleton className="w-full h-[333px]" />
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-base mb-1 font-medium">
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <span className="text-xs font-medium">
                            <Skeleton className="h-2 w-[40px]" />
                        </span>
                    </div>
                </div>
                <div className="text-xs font-medium p-2 rounded-md bg-slate-200 hover:bg-slate-400">
                    <Skeleton className="h-4 w-10" />
                </div>
            </div>
        </div>
    )
}

export default ItemCardSkeleton
