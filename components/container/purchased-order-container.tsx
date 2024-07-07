"use client"

import { useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import { IOrderDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import PurchasedOrderSkeleton from "../skeleton/purchased-order-skeleton"
import DialogRefundOrder from "../shared/dialog-refund-order"
import DialogConfirmOrder from "../shared/dialog-confirm-order"

const typePetToText = {
    food: "Đồ ăn",
    toys: "Đồ chơi",
    medicine: "Thuốc",
    accessories: "Phụ kiện",
    housing: "Nhà ở",
    training: "Huấn luyện",
    service: "Dịch vụ",
    other: "Khác",
}

const statusOrder = {
    pending: "Chưa thanh toán",
    offline: "Thanh toán khi nhận hàng",
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
    /** Alert Dialog */
    const [openAlert, setOpenAlert] = useState<null | number>(null)

    const handleUpdateOrder = (updatedOrder: IOrderDocument) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)),
        )
    }

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
                    setContentSnackbar(data.message || "Xảy ra lỗi khi tải thêm dữ liệu")
                    return
                }
                if (data.success) {
                    setOrders(data.data as IOrderDocument[])
                }
            } catch (error) {
                console.error("Failed to fetch order: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Xảy ra lỗi khi tải danh sách hóa đơn")
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
                        <div className="w-full h-full flex justify-center items-center text-brown-1">
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
                                            order.status === "cancelled" &&
                                            order.typePayment === "online" && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setOpen(order.orderCode)}
                                                >
                                                    Yêu cầu hoàn tiền
                                                </Button>
                                            )}
                                        {order.refund === order.totalAmount &&
                                            order.status === "cancelled" &&
                                            order.typePayment === "online" && (
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
                                                onClick={() => setOpenAlert(order.orderCode)}
                                            >
                                                Xác nhận đơn hàng
                                            </Button>
                                        )}
                                    </div>
                                    <DialogConfirmOrder
                                        open={openAlert}
                                        setOpen={setOpenAlert}
                                        order={order}
                                        onUpdateOrder={handleUpdateOrder}
                                    />
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
