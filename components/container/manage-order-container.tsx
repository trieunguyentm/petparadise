"use client"

import { IOrderDocument } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ManageOrderCard from "../shared/manage-order-card"
import SnackbarCustom from "../ui/snackbar"

export type StatusOrder =
    | "pending"
    | "processed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "success"

const ManageOrderContainer = () => {
    /** Router */
    const router = useRouter()
    /** Order */
    const [orders, setOrders] = useState<IOrderDocument[]>([])
    /** Loading */
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    useEffect(() => {
        async function fetchMyOrder() {
            try {
                setLoadingOrder(true)
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/my-order`,
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
                if (data.success) {
                    setOrders(data.data as IOrderDocument[])
                }
            } catch (error) {
                console.error("Failed to fetch order: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch order")
            } finally {
                setLoadingOrder(false)
            }
        }
        fetchMyOrder()
    }, [])

    return (
        <>
            {orders.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                    Hiện tại không có đơn hàng nào
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {orders.map((order, index) => (
                        <ManageOrderCard key={index} orderProp={order} />
                    ))}
                </div>
            )}
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default ManageOrderContainer
