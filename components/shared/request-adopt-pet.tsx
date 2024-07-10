import { IAdoptionRequestDocument } from "@/types"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Check, Loader2, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

const RequestAdoptPet = ({
    request,
    setOpenSnackbar,
    setTypeSnackbar,
    setContentSnackbar,
}: {
    request: IAdoptionRequestDocument
    setOpenSnackbar: (arg: boolean) => void
    setTypeSnackbar: (arg: "success" | "info" | "warning" | "error") => void
    setContentSnackbar: (arg: string) => void
}) => {
    const router = useRouter()
    const [load, setLoad] = useState<boolean>(false)

    const handleRequest = async (status: "approved" | "rejected") => {
        if (status === "approved" && request.status === "approved") return
        if (status === "rejected" && request.status === "rejected") return
        setLoad(true)
        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/adoption-request/handle/${request._id.toString()}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: status,
                    }),
                },
            )
            const data = await res.json()
            if (!res.ok) {
                if (data.type === "ERROR_SESSION") {
                    // Lưu thông báo vào localStorage
                    localStorage.setItem(
                        "toastMessage",
                        JSON.stringify({ type: "error", content: data.message }),
                    )
                    router.push("/login")
                    return
                }
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className="bg-slate-100 rounded-md p-2 flex flex-col gap-2">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Image
                        onClick={() => router.push(`/profile/${request.requester.username}`)}
                        src={request.requester.profileImage || "/assets/images/avatar.jpeg"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                        style={{ clipPath: "circle()" }}
                    />
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">{request.requester.username}</div>
                        <div className="text-xs">
                            {request.status === "pending" && (
                                <span className="text-gray-500">Đang chờ phê duyệt</span>
                            )}
                            {request.status === "rejected" && (
                                <span className="text-red-500">Đã từ chối</span>
                            )}
                            {request.status === "approved" && (
                                <span className="text-green-500">Đã chấp nhận</span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {load ? <Loader2 className="w-6 h-6 animate-spin" /> : <Menu />}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleRequest("approved")}>
                                    <Check className="mr-2 h-4 w-4" />
                                    <span>Đồng ý yêu cầu</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRequest("rejected")}>
                                    <X className="mr-2 h-4 w-4" />
                                    <span>Từ chối yêu cầu</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div>
                <span className="font-medium text-sm">
                    Loại yêu cầu :{" "}
                    {request.type === "reclaim-pet"
                        ? "Nhận lại thú cưng bị mất"
                        : "Tôi muốn nhận nuôi thú cưng"}
                </span>
            </div>
            {request.type === "reclaim-pet" && (
                <div>
                    <span className="font-medium text-sm">
                        Các mô tả về thú cưng: {request.descriptionForPet}
                    </span>
                </div>
            )}
            {request.type === "adopt-pet" && (
                <div>
                    <span className="font-medium text-sm">
                        Giới thiệu về kinh nghiệm bản thân: {request.descriptionForUser}
                    </span>
                </div>
            )}
            <div>
                <span className="font-medium text-sm">
                    Thông tin liên hệ: {request.contactInfo}
                </span>
            </div>
            {request.images && request.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {request.images.map((image, index) => (
                        <div key={index}>
                            <Image src={image} width={1000} height={200} alt="image-attach" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RequestAdoptPet
