import { IReportDocument } from "@/types"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link2, Loader2, Wrench } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"

const convertStatus = {
    pending: "Đang chờ xử lý",
    reviewing: "Đang xử lý",
    resolved: "Đã xử lý",
}

const ReportDetailAdmin = ({ report }: { report: IReportDocument }) => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [currentReport, setCurrentReport] = useState<IReportDocument>(report)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleSetStatus = async (newStatus: "pending" | "reviewing" | "resolved") => {
        if (currentReport.status === newStatus) return
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-report`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    newStatus: newStatus,
                    reportId: report._id.toString(),
                }),
            })
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
                setCurrentReport(data.data as IReportDocument)
            }
        } catch (error) {
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi cập nhật trạng thái báo cáo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border border-brown-1 rounded-md p-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            // onClick={() => router.push(`/profile/${post.poster.username}`)}
                            src={report.reporter.profileImage || "/assets/images/avatar.jpeg"}
                            alt="@avatar"
                        />
                        <AvatarFallback>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">{report.reporter.username}</div>
                        <div
                            className="text-xs font-thin"
                            // onClick={() => router.push(`/post/${post._id.toString()}`)}
                        >
                            Ngày tạo báo cáo: {convertISOToFormat(report.createdAt)}
                        </div>
                    </div>
                </div>
                <div className="text-xs flex gap-1">
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                        className={`${currentReport.status === "resolved" && "text-green-600"} ${
                            currentReport.status === "pending" && "text-gray-600"
                        } ${
                            currentReport.status === "reviewing" && "text-blue-600"
                        } flex items-center`}
                    >
                        {convertStatus[currentReport.status]}{" "}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={loading}>
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
                                    <DropdownMenuItem onClick={() => handleSetStatus("pending")}>
                                        {/* <User className="mr-2 h-4 w-4" /> */}
                                        <span className="text-xs">Đang chờ xử lý</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSetStatus("reviewing")}>
                                        {/* <User className="mr-2 h-4 w-4" /> */}
                                        <span className="text-xs">Đang xử lý</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSetStatus("resolved")}>
                                        {/* <User className="mr-2 h-4 w-4" /> */}
                                        <span className="text-xs">Đã xử lý</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </span>
                </div>
            </div>
            <div className="text-xs">
                <span className="font-semibold">Mô tả vi phạm:</span> {report.description}
            </div>
            <div className="text-xs flex flex-row items-center gap-2">
                <span className="font-semibold">Đường dẫn đến nội dung vi phạm:</span>{" "}
                <Link href={`${report.link}`} target="_blank">
                    <Link2 className="text-brown-1" />
                </Link>
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

export default ReportDetailAdmin
