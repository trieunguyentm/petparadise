import { IRefundRequestDocument } from "@/types"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2, Wrench } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Bank } from "./dialog-refund-order"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Link from "next/link"
import SnackbarCustom from "../ui/snackbar"

const convertStatus = {
    pending: "Đang đợi xử lý",
    approved: "Đã xử lý",
}

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

const RefundRequestDetail = ({
    refundRequest,
    listBank,
}: {
    refundRequest: IRefundRequestDocument
    listBank: Bank[]
}) => {
    const router = useRouter()
    // Bank
    const [bank, setBank] = useState<Bank | undefined>(undefined)
    // Snack Bar
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    // Status
    const [status, setStatus] = useState<"pending" | "approved">(refundRequest.status)
    // Loading
    const [loading, setLoading] = useState<boolean>(false)

    const handleSetStatus = async (newStatus: "pending" | "approved") => {
        if (newStatus === status) return
        try {
            setLoading(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-refund-request`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        newStatus: newStatus,
                        refundRequestId: refundRequest._id.toString(),
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
                setContentSnackbar(data.message || "Xảy ra lỗi khi xóa dữ liệu")
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setStatus(data.data.status)
            }
        } catch (error) {
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi cập nhật trạng thái yêu cầu hoàn tiền")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setBank(listBank.find((bank) => bank.code === refundRequest.bankCode))
    }, [listBank])

    return (
        <div className="border border-brown-1 rounded-md p-2 flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={
                                refundRequest.order.buyer.profileImage ||
                                "/assets/images/avatar.jpeg"
                            }
                            alt="@avatar"
                        />
                        <AvatarFallback>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">
                            {refundRequest.order.buyer.username}
                        </div>
                        <div className="text-xs font-thin">
                            Ngày tạo yêu cầu hoàn tiền:{" "}
                            {convertISOToFormat(refundRequest.createdAt)}
                        </div>
                    </div>
                </div>
                <div className="text-xs flex gap-1">
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                        className={`${status === "pending" && "text-gray-600"} ${
                            status === "approved" && "text-green-600"
                        } flex items-center`}
                    >
                        {convertStatus[status]}{" "}
                        {!loading && status !== "approved" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    {loading ? (
                                        <Loader2 className="animate-spin w-4 h-4 cursor-pointer text-brown-1" />
                                    ) : (
                                        <Wrench className="w-4 h-4 cursor-pointer text-brown-1" />
                                    )}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="px-2">
                                    <DropdownMenuLabel>
                                        <span className="text-xs text-brown-1 font-semibold">
                                            Cập nhật trạng thái
                                        </span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => handleSetStatus("pending")}
                                        >
                                            <span className="text-xs">Đang đợi xử lý</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleSetStatus("approved")}
                                        >
                                            <span className="text-xs">Đã xử lý</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </span>
                </div>
            </div>
            {/* THÔNG TIN NGÂN HÀNG */}
            <div className="flex flex-col gap-1 text-xs">
                <div className="text-xs">
                    <span className="font-semibold">Số tiền hoàn lại:</span>{" "}
                    {refundRequest.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                </div>
                <div className="text-xs">
                    <span className="font-semibold">Mã ngân hàng (Bank Code):</span>{" "}
                    {refundRequest.bankCode}
                </div>
                <div className="text-xs flex gap-1 items-center">
                    <span className="font-semibold">Tên ngân hàng:</span>{" "}
                    {!bank ? <Loader2 className="w-4 h-4 animate-spin" /> : bank.name}
                    {bank && <Image alt="logo-bank" src={bank.logo} width={40} height={40} />}
                </div>
                <div className="text-xs">
                    <span className="font-semibold">Số tài khoản:</span>{" "}
                    {refundRequest.accountNumber}
                </div>
                <div className="text-xs">
                    <span className="font-semibold">Tên chủ tài khoản:</span>{" "}
                    {refundRequest.accountName}
                </div>
            </div>
            {/* THÔNG TIN ĐƠN HÀNG */}
            <div className="flex flex-col gap-1 text-xs border p-2 rounded-lg">
                <div>
                    <span className="text-brown-1 font-semibold">Mã đơn hàng:</span>{" "}
                    {refundRequest.order.orderCode}
                </div>
                <div>
                    <span className="text-brown-1 font-semibold">Hình thức thanh toán:</span>{" "}
                    {refundRequest.order.typePayment === "online"
                        ? "Thanh toán trực tuyến"
                        : "Thanh toán sau khi nhận hàng"}
                </div>
                <div>
                    <span className="text-brown-1 font-semibold">Tổng giá trị:</span>{" "}
                    {refundRequest.order.totalAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    đ
                </div>
                <div>
                    <span className="text-brown-1 font-semibold">Thông tin đơn hàng</span>
                    <ul className="mt-2 flex flex-col gap-2 text-xs">
                        <li>
                            <span>&bull;Tên người nhận: </span>
                            {refundRequest.order.buyerName || "Không có"}{" "}
                            {`(${refundRequest.order.buyer.username})`}
                        </li>
                        <li>
                            <span>&bull;Địa chỉ email người mua: </span>
                            {refundRequest.order.buyerEmail || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Số điện thoại người mua: </span>
                            {refundRequest.order.buyerPhone || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Địa chỉ người mua: </span>
                            {refundRequest.order.buyerAddress || "Không có"}
                        </li>
                        <li>
                            <span>&bull;Ghi chú: </span>
                            {refundRequest.order.buyerNote || "Không có"}
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    {refundRequest.order.products.map((product, indexProduct) => (
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
                                        target="_blank"
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
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default RefundRequestDetail
