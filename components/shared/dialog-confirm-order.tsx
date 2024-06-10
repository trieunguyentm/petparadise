import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IOrderDocument } from "@/types"
import { X } from "lucide-react"
import SnackbarCustom from "../ui/snackbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

const DialogConfirmOrder = ({
    open,
    setOpen,
    order,
    onUpdateOrder,
}: {
    open: number | null
    setOpen: (arg: number | null) => void
    order: IOrderDocument
    onUpdateOrder: (order: IOrderDocument) => void
}) => {
    const router = useRouter()
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleConfirmOrder = async (typeConfirm: "accept" | "cancel") => {
        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/product/${order._id.toString()}/confirm-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        typeConfirm,
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success) {
                onUpdateOrder(data.data as IOrderDocument) // Cập nhật order trong component cha
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setOpen(null)
            }
        } catch (error) {
            console.error("Xảy ra lỗi khi xác nhận hóa đơn: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi khi xác nhận hóa đơn")
        }
    }

    return (
        <>
            <AlertDialog open={open === order.orderCode}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div
                            className="w-full flex justify-end cursor-pointer"
                            onClick={() => setOpen(null)}
                        >
                            <X />
                        </div>
                        <AlertDialogTitle>Xác nhận đơn hàng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Nếu đã nhận được sản phẩm, hãy xác nhận đã nhận được. Nếu chưa hãy hủy
                            xác nhận và thử liên hệ với người bán.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-red-500" onClick={() => handleConfirmOrder("cancel")}>Hủy xác nhận</AlertDialogAction>
                        <AlertDialogAction className="bg-blue-500" onClick={() => handleConfirmOrder("accept")}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default DialogConfirmOrder
