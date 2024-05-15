"use client"

import { INotificationDocument, IUserDocument } from "@/types"
import Notification from "./notification"
import { useCallback, useEffect, useState } from "react"
import { pusherClient } from "@/lib/pusher"
import { useInView } from "react-intersection-observer"
import { NOTIFICATION_PER_PAGE } from "@/lib/data"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"

const ListNotification = ({
    dataNotification,
    user,
}: {
    dataNotification: {
        notifications: INotificationDocument[]
        total: number
        offset: number
        limit: number
    } | null
    user: IUserDocument
}) => {
    const router = useRouter()
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    const [listNotification, setListNotification] = useState<INotificationDocument[]>(
        dataNotification ? dataNotification?.notifications : [],
    )
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState(true)
    /** Intersection Observer */
    const { ref, inView } = useInView()

    const fetchMorePosts = useCallback(() => {
        setPage((prevPage) => prevPage + 1)
    }, [])

    const handleNewNotification = async (newNotification: INotificationDocument) => {
        setListNotification((prev) => [newNotification, ...prev])
    }

    useEffect(() => {
        async function loadMoreData() {
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/user/notification?limit=${NOTIFICATION_PER_PAGE}&offset=${
                        page * NOTIFICATION_PER_PAGE
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
                if (data.success && data.data.length) {
                    const newNotification = data.data.notifications.filter(
                        (notification: INotificationDocument) =>
                            !listNotification.some((n) => n._id === notification._id),
                    )
                    setListNotification((prev) => [...prev, ...newNotification])
                    setHasMore(data.data.notifications.length > 0)
                } else {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch more data")
            }
        }

        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        pusherClient.subscribe(`user-${user._id.toString()}-notifications`)
        pusherClient.bind("new-notification", handleNewNotification)
    }, [user])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMorePosts()
        }
    }, [inView])

    return (
        <div className="p-2 max-h-[40vh] min-h-[200px] w-[100%] overflow-auto bg-white rounded-xl flex flex-col gap-5 border-brown-1 border">
            {listNotification.length === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                    No notifications
                </div>
            )}
            {listNotification.length > 0 && (
                <>
                    {listNotification.map((notification) => (
                        <Notification
                            key={notification._id.toString()}
                            notification={notification}
                        />
                    ))}
                    <div ref={ref}></div>
                </>
            )}
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default ListNotification
