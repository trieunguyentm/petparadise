import React from "react"
import { Skeleton } from "../ui/skeleton"

const UserCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-[50px] h-[50px] rounded-full" />
                    <div className="flex flex-col gap-4">
                        <div className="font-medium text-xl text-brown-1">
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="text-gray-500 opacity-8 text-sm">
                            <Skeleton className="h-4 w-[120px]" />
                        </div>
                    </div>
                </div>
                <button className="cursor-pointer hover:opacity-50">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </button>
            </div>
            <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-[50px] h-[50px] rounded-full" />
                    <div className="flex flex-col gap-4">
                        <div className="font-medium text-xl text-brown-1">
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="text-gray-500 opacity-8 text-sm">
                            <Skeleton className="h-4 w-[120px]" />
                        </div>
                    </div>
                </div>
                <button className="cursor-pointer hover:opacity-50">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </button>
            </div>
            <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-[50px] h-[50px] rounded-full" />
                    <div className="flex flex-col gap-4">
                        <div className="font-medium text-xl text-brown-1">
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="text-gray-500 opacity-8 text-sm">
                            <Skeleton className="h-4 w-[120px]" />
                        </div>
                    </div>
                </div>
                <button className="cursor-pointer hover:opacity-50">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </button>
            </div>
            <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-[50px] h-[50px] rounded-full" />
                    <div className="flex flex-col gap-4">
                        <div className="font-medium text-xl text-brown-1">
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="text-gray-500 opacity-8 text-sm">
                            <Skeleton className="h-4 w-[120px]" />
                        </div>
                    </div>
                </div>
                <button className="cursor-pointer hover:opacity-50">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </button>
            </div>
        </div>
    )
}

export default UserCardSkeleton
