import { Skeleton } from "../ui/skeleton"

const ChangePasswordSkeleton = () => {
    return (
        <>
            <div className="flex flex-col">
                <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                    Tài khoản
                </div>
                <div className="py-5 flex flex-col text-brown-1 gap-2">
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Tên người dùng</div>
                        <div className="w-5/6 text-sm">
                            <Skeleton className="w-[100px] h-4" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Gmail</div>
                        <div className="w-5/6 text-sm">
                            <Skeleton className="w-[140px] h-4" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Mật khẩu</div>
                        <div className="w-5/6 text-sm flex gap-4">
                            <Skeleton className="w-[120px] h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePasswordSkeleton
