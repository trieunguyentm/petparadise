import { IOrderDocument, IProductDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { StatusOrder } from "../container/manage-order-container"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

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

const statusOrder: { [key: string]: string } = {
    pending: "Chưa thanh toán",
    offline: "Thanh toán khi giao hàng",
    processed: "Đã thanh toán",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    success: "Đã hoàn thành",
}

const ManageOrderCard = ({ orderProp }: { orderProp: IOrderDocument }) => {
    const router = useRouter()
    const [order, setOrder] = useState<IOrderDocument>(orderProp)
    const [currentStatus, setCurrentStatus] = useState<StatusOrder>(order.status)
    const [status, setStatus] = useState<StatusOrder>(order.status)
    const [loadingSet, setLoadingSet] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleSetStatusOrder = async () => {
        setLoadingSet(true)
        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/product/${orderProp._id.toString()}/set-order`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
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
                setContentSnackbar(data.message || "Xảy ra lỗi khi cập nhật trạng thái đơn hàng")
                return
            }
            if (data.success) {
                setOrder(data.data as IOrderDocument)
            }
        } catch (error: any) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingSet(false)
        }
    }

    useEffect(() => {
        setCurrentStatus(order.status)
        setStatus(order.status)
    }, [order])

    return (
        <div className="border p-2 rounded-lg text-sm flex max-md:flex-col max-md:gap-2 md:justify-between">
            <div className="flex flex-col gap-2">
                <div>
                    <span className="text-brown-1 font-semibold">Mã đơn hàng:</span>{" "}
                    {order.orderCode}
                </div>
                <div>
                    <span className="text-brown-1 font-semibold">Tổng giá trị:</span>{" "}
                    {order.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                </div>
                <div>
                    <span className="text-brown-1 font-semibold">Thông tin đơn hàng</span>
                    <ul className="mt-2 text-sm flex flex-col gap-2">
                        <li>
                            <span>&bull;Tên người nhận: </span>
                            {order.buyerName || "Không có"} {`(${order.buyer.username})`}
                        </li>
                        <li>
                            <span>&bull;Địa chỉ email người mua: </span>
                            {order.buyerEmail || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Số điện thoại người mua: </span>
                            {order.buyerPhone || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Địa chỉ người mua: </span>
                            {order.buyerAddress || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Ghi chú: </span>
                            {order.buyerNote || "Không có"}
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    {order.products.map((product, indexProduct) => (
                        <div className="flex flex-col gap-2" key={indexProduct}>
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
                                        {product.product.name} x {product.quantity}
                                    </Link>
                                    <div>
                                        Loại sản phẩm: {typePetToText[product.product.productType]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="text-sm text-brown-1 font-semibold">Trạng thái đơn hàng</div>

                <Select
                    // Không thể thay đổi trạng thái khi "cancelled", "delivered", "success"
                    disabled={
                        currentStatus === "cancelled" ||
                        currentStatus === "delivered" ||
                        currentStatus === "success"
                    }
                    value={status}
                    onValueChange={(value: StatusOrder) => setStatus(value)}
                >
                    <SelectTrigger className="w-[120px] text-xs p-0.5">
                        <SelectValue placeholder="Trạng thái đơn hàng" />
                    </SelectTrigger>
                    {order.typePayment === "online" && (
                        <SelectContent className="text-xs">
                            {Object.keys(statusOrder).map((type, index) => {
                                if (
                                    type === "processed" ||
                                    type === "shipped" ||
                                    type === "delivered" ||
                                    type === "cancelled"
                                ) {
                                    return (
                                        <SelectItem key={index} value={type} className="text-xs">
                                            {statusOrder[type]}
                                        </SelectItem>
                                    )
                                }
                            })}
                            {/* Khi trạng thái đơn hàng là success rồi thì mới hiển thị option này trong Select
                        nếu không người bán có thể tự đặt trạng thái là success */}
                            {status === "success" && (
                                <SelectItem value={"success"} className="text-xs">
                                    {statusOrder["success"]}
                                </SelectItem>
                            )}
                        </SelectContent>
                    )}
                    {order.typePayment === "offline" && (
                        <SelectContent className="text-xs">
                            {Object.keys(statusOrder).map((type, index) => {
                                if (
                                    type === "offline" ||
                                    type === "shipped" ||
                                    type === "cancelled" ||
                                    type === "delivered"
                                ) {
                                    return (
                                        <SelectItem key={index} value={type} className="text-xs">
                                            {statusOrder[type]}
                                        </SelectItem>
                                    )
                                }
                            })}
                            {status === "success" && (
                                <SelectItem value={"success"} className="text-xs">
                                    {statusOrder["success"]}
                                </SelectItem>
                            )}
                        </SelectContent>
                    )}
                </Select>

                {status !== currentStatus && (
                    <Button variant="outline" onClick={handleSetStatusOrder}>
                        {loadingSet ? <Loader2 className="w-8 h-8 animate-spin" /> : "Lưu"}
                    </Button>
                )}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default ManageOrderCard
