import { IWithdrawalHistory } from "@/types"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2, Wrench } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Bank } from "./dialog-refund-order"
import Image from "next/image"
import SnackbarCustom from "../ui/snackbar"

const convertStatus = {
    pending: "Đang đợi xử lý",
    completed: "Đã hoàn thành",
    failed: "Đã hủy",
}

const DrawMoneyHistoryDetail = ({
    drawMoneyHistory,
    listBank,
}: {
    drawMoneyHistory: IWithdrawalHistory
    listBank: Bank[]
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const [bank, setBank] = useState<Bank | undefined>(undefined)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    const [statusDrawMoney, setStatusDrawMoney] = useState<"pending" | "completed" | "failed">(
        drawMoneyHistory.status,
    )

    const handleSetStatus = async (newStatus: "pending" | "completed" | "failed") => {
        if (newStatus === statusDrawMoney) return
        try {
            setLoading(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-draw-money-history`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        newStatus: newStatus,
                        drawMoneyHistoryId: drawMoneyHistory._id.toString(),
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
                setContentSnackbar(data.message || "Xảy ra lỗi khi cập nhật")
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setStatusDrawMoney(data.data.status)
            }
        } catch (error) {
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi cập nhật trạng thái yêu cầu nhận tiền")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setBank(listBank.find((bank) => bank.code === drawMoneyHistory.bankCode))
    }, [listBank])

    return (
        <div className="border border-brown-1 rounded-md p-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            // onClick={() => router.push(`/profile/${post.poster.username}`)}
                            src={drawMoneyHistory.user.profileImage || "/assets/images/avatar.jpeg"}
                            alt="@avatar"
                        />
                        <AvatarFallback>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">{drawMoneyHistory.user.username}</div>
                        <div
                            className="text-xs font-thin"
                            // onClick={() => router.push(`/post/${post._id.toString()}`)}
                        >
                            Ngày tạo yêu cầu nhận tiền:{" "}
                            {convertISOToFormat(drawMoneyHistory.createdAt)}
                        </div>
                    </div>
                </div>
                <div className="text-xs flex gap-1">
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                        className={`${statusDrawMoney === "completed" && "text-green-600"} ${
                            statusDrawMoney === "pending" && "text-gray-600"
                        } ${statusDrawMoney === "failed" && "text-red-600"} flex items-center`}
                    >
                        {convertStatus[statusDrawMoney]}{" "}
                        {!loading && statusDrawMoney !== "completed" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    asChild
                                    // disabled={loading || statusDrawMoney === "completed"}
                                >
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
                                            {/* <User className="mr-2 h-4 w-4" /> */}
                                            <span className="text-xs">Đang đợi xử lý</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleSetStatus("completed")}
                                        >
                                            {/* <User className="mr-2 h-4 w-4" /> */}
                                            <span className="text-xs">Đã hoàn thành</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSetStatus("failed")}>
                                            {/* <User className="mr-2 h-4 w-4" /> */}
                                            <span className="text-xs">Đã hủy</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </span>
                </div>
            </div>
            <div className="text-xs">
                <span className="font-semibold">Số tiền nhận lại:</span>{" "}
                {drawMoneyHistory.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
            </div>
            <div className="text-xs">
                <span className="font-semibold">Mã ngân hàng (Bank Code):</span>{" "}
                {drawMoneyHistory.bankCode}
            </div>
            <div className="text-xs flex gap-1 items-center">
                <span className="font-semibold">Tên ngân hàng:</span>{" "}
                {!bank ? <Loader2 className="w-4 h-4 animate-spin" /> : bank.name}
                {bank && <Image alt="logo-bank" src={bank.logo} width={40} height={40} />}
            </div>
            <div className="text-xs">
                <span className="font-semibold">Số tài khoản:</span>{" "}
                {drawMoneyHistory.accountNumber}
            </div>
            <div className="text-xs">
                <span className="font-semibold">Tên chủ tài khoản:</span>{" "}
                {drawMoneyHistory.accountName}
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

export default DrawMoneyHistoryDetail
