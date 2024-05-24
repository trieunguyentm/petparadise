"use client"

import { IAdoptionRequestDocument, IUserDocument } from "@/types"
import { request } from "http"
import { ArrowLeft, Check, Loader2, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import SnackbarCustom from "../ui/snackbar"
import { POST_PER_PAGE } from "@/lib/data"

const PetAdoptionRequestDetail = ({
    postId,
    dataRequest,
    user,
}: {
    postId: string
    dataRequest: { adoptionRequests: IAdoptionRequestDocument[]; totalRequests: number }
    user: IUserDocument
}) => {
    const router = useRouter()
    const [totalRequests, setTotalRequests] = useState<number>(dataRequest.totalRequests)
    const [requests, setRequests] = useState<IAdoptionRequestDocument[]>(
        dataRequest.adoptionRequests,
    )
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    // Loading when load more
    const [loading, setLoading] = useState<boolean>(false)
    /** Load more */
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState(true)
    /** Intersection Observer */
    const { ref, inView } = useInView()

    const fetchMoreRequest = useCallback(() => {
        setPage((prevPage) => prevPage + 1)
    }, [])

    useEffect(() => {
        async function loadMoreData() {
            try {
                setLoading(true)
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/adoption-request/${postId}?limit=${POST_PER_PAGE}&offset=${
                        page * POST_PER_PAGE
                    }`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
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
                    setContentSnackbar(data.message || "Error loading more posts")
                    return
                }
                if (data.success && data.data.adoptionRequests.length) {
                    const newRequest = data.data.adoptionRequests.filter(
                        (request: IAdoptionRequestDocument) =>
                            !requests.some((r) => r._id === request._id),
                    )
                    setRequests((prev) => [...prev, ...newRequest])
                    setHasMore(data.data.adoptionRequests.length > 0)
                } else {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch more data")
            } finally {
                setLoading(false)
            }
        }

        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreRequest()
        }
    }, [inView])

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col text-brown-1">
                        <div
                            onClick={() => router.push(`/pet-adoption/${postId}`)}
                            className="mb-1 cursor-pointer"
                        >
                            <ArrowLeft />
                        </div>
                    </div>
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Yêu cầu nhận nuôi thú cưng</div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {requests.map((request, index) => {
                            return (
                                <div
                                    key={index}
                                    className="bg-slate-100 rounded-md p-2 flex flex-col gap-2"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex gap-2">
                                            <Image
                                                src={
                                                    request.requester.profileImage ||
                                                    "/assets/images/avatar.jpeg"
                                                }
                                                alt="avatar"
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium">
                                                    {request.requester.username}
                                                </div>
                                                <div className="text-xs">
                                                    {request.status === "pending" && (
                                                        <span className="text-gray-500">
                                                            Đang chờ phê duyệt
                                                        </span>
                                                    )}
                                                    {request.status === "rejected" && (
                                                        <span className="text-red-500">
                                                            Đã từ chối
                                                        </span>
                                                    )}
                                                    {request.status === "approved" && (
                                                        <span className="text-green-500">
                                                            Đã chấp nhận
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Menu />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem
                                                        // onClick={handleRequestReclaimPet}
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            <span>Đồng ý yêu cầu</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                        // onClick={handleRequestReclaimPet}
                                                        >
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
                                                Giới thiệu về kinh nghiệm bản thân:{" "}
                                                {request.descriptionForUser}
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
                                                    <Image
                                                        src={image}
                                                        width={1000}
                                                        height={200}
                                                        alt="image-attach"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        <div ref={ref} className="w-full justify-center flex">
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        </div>
                    </div>
                    <SnackbarCustom
                        open={openSnackbar}
                        setOpen={setOpenSnackbar}
                        type={typeSnackbar}
                        content={contentSnackbar}
                    />
                </div>
            </div>
        </div>
    )
}

export default PetAdoptionRequestDetail
