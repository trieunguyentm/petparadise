"use client"

import { useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import { IOrderDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import PurchasedOrderSkeleton from "../skeleton/purchased-order-skeleton"
import DialogRefundOrder from "../shared/dialog-refund-order"

const typePetToText = {
    food: "Đồ ăn",
    toys: "Đồ chơi",
    medicine: "Thuốc",
    accessories: "Phụ kiện",
    housing: "Nhà ở",
    training: "Huấn luyện",
    other: "Khác",
}

const statusOrder = {
    pending: "Chưa thanh toán",
    processed: "Đã thanh toán",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    success: "Đã hoàn thành",
}

const PurchasedOrderContainer = () => {
    /** Router */
    const router = useRouter()
    /** Order */
    const [orders, setOrders] = useState<IOrderDocument[]>([])
    /** Loading */
    const [loadingOrder, setLoadingOrder] = useState<boolean>(true)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Dialog */
    const [open, setOpen] = useState<null | number>(null)

    useEffect(() => {
        async function fetchPurchasedOrder() {
            try {
                setLoadingOrder(true)
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/purchased-order`,
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
        fetchPurchasedOrder()
    }, [])

    return (
        <>
            {loadingOrder ? (
                <div className="flex flex-col gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <PurchasedOrderSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <div className="w-full h-full flex justify-center items-center">
                            Hiện tại không có đơn hàng nào
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {orders.map((order, item) => (
                                <div
                                    key={item}
                                    className="border p-2 rounded-lg text-sm flex max-md:flex-col max-md:gap-2 md:justify-between"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <span className="text-brown-1 font-semibold">
                                                Mã đơn hàng:
                                            </span>{" "}
                                            {order.orderCode}
                                        </div>
                                        <div>
                                            <span className="text-brown-1 font-semibold">
                                                Tổng giá trị:
                                            </span>{" "}
                                            {order.totalAmount
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                            đ
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {order.products.map((product, indexProduct) => (
                                                <div
                                                    className="flex flex-col gap-2"
                                                    key={indexProduct}
                                                >
                                                    <div className="flex items-center gap-2 mt-5">
                                                        <Image
                                                            src={product.product.images[0]}
                                                            alt="product-image"
                                                            width={150}
                                                            height={150}
                                                            className="border rounded-xl p-2"
                                                        />
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={`/store/product-detail/${product.product._id.toString()}`}
                                                                className="text-base font-medium text-brown-1"
                                                            >
                                                                {product.product.name} x{" "}
                                                                {product.quantity}
                                                            </Link>
                                                            <div>
                                                                Loại sản phẩm:{" "}
                                                                {
                                                                    typePetToText[
                                                                        product.product.productType
                                                                    ]
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm text-brown-1 font-semibold">
                                            Trạng thái:{" "}
                                            <span
                                                className={`${
                                                    order.status === "cancelled" && "text-red-500"
                                                } ${
                                                    order.status === "success" && "text-green-500"
                                                }`}
                                            >
                                                {statusOrder[order.status]}
                                            </span>
                                        </div>
                                        {order.refund !== order.totalAmount &&
                                            order.status === "cancelled" && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setOpen(order.orderCode)}
                                                >
                                                    Yêu cầu hoàn tiền
                                                </Button>
                                            )}
                                        {order.refund === order.totalAmount &&
                                            order.status === "cancelled" && (
                                                <Button
                                                    variant="outline"
                                                    className="bg-green-500"
                                                    disabled={true}
                                                >
                                                    Đã hoàn tiền
                                                </Button>
                                            )}
                                        {order.status === "delivered" && (
                                            <Button
                                                variant="outline"
                                                className="bg-green-500 text-white"
                                            >
                                                Xác nhận đơn hàng
                                            </Button>
                                        )}
                                    </div>
                                    <DialogRefundOrder
                                        open={open}
                                        setOpen={setOpen}
                                        order={order}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
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

export default PurchasedOrderContainer
