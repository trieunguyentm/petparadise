"use client"

import { IAdoptionRequestDocument, IUserDocument } from "@/types"
import { ArrowLeft, Check, Loader2, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import SnackbarCustom from "../ui/snackbar"
import { POST_PER_PAGE } from "@/lib/data"
import RequestAdoptPet from "./request-adopt-pet"
import { pusherClient } from "@/lib/pusher"

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

    const handleUpdateRequest = (newRequest: IAdoptionRequestDocument) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) => (request._id === newRequest._id ? newRequest : request)),
        )
        if (newRequest.status === "approved") {
            setOpenSnackbar(true)
            setTypeSnackbar("info")
            setContentSnackbar(
                `Đã ${newRequest.status === "approved" ? "chấp nhận" : "từ chối"} yêu cầu`,
            )
        }
    }

    useEffect(() => {
        pusherClient.subscribe(`adopt-pet-${postId}`)
        pusherClient.bind(`new-status`, handleUpdateRequest)

        return () => {
            pusherClient.unsubscribe(`adopt-pet-${postId}`)
            pusherClient.unbind(`new-status`, handleUpdateRequest)
        }
    }, [postId])

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
                    <div className="flex flex-col gap-8">
                        {requests.map((request, index) => {
                            return (
                                <RequestAdoptPet
                                    key={index}
                                    request={request}
                                    setOpenSnackbar={setOpenSnackbar}
                                    setTypeSnackbar={setTypeSnackbar}
                                    setContentSnackbar={setContentSnackbar}
                                />
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
