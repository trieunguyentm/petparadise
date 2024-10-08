"use client"

import { INotificationDocument } from "@/types"
import { Dot, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import SnackbarCustom from "../ui/snackbar"

const Notification = ({ notification }: { notification: INotificationDocument }) => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [seen, setSeen] = useState<boolean>(notification.status === "seen" ? true : false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleClickNotification = async () => {
        if (seen) {
            if (notification.moreInfo) {
                router.push(notification.moreInfo)
            } else {
                return
            }
        }
        const prevState = seen
        if (!seen) {
            setSeen(true)
        }
        try {
            setLoading(true)
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/user/notification/${notification._id.toString()}`,
                {
                    method: "PUT",
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
                // setOpenSnackbar(true)
                // setTypeSnackbar("error")
                // setContentSnackbar(data.message || "Error loading more posts")
                return
            }
        } catch (error) {
            setSeen(prevState)
            console.error("Failed to seen notification: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoading(false)
        }

        if (notification.moreInfo) {
            router.push(notification.moreInfo)
        } else {
            return
        }
    }

    return (
        <div
            className="border-l-2 pl-1 my-2 border-brown-1 cursor-pointer hover:bg-slate-100"
            onClick={handleClickNotification}
        >
            <div className="font-medium text-base text-brown-1 flex items-center">
                {notification.title}
                {!seen && <Dot className="text-blue-500" />}
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <div className={`text-sm font-thin`}>{notification.subtitle}</div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default Notification
