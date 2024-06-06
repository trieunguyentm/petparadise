"use client"

import { ListGroupedItem } from "@/app/(root)/store/cart/page"
import { IUserDocument } from "@/types"
import { useState } from "react"
import CartItem from "../shared/cart-item"
import { Button } from "../ui/button"
import { MoveRight } from "lucide-react"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"

type FormValues = {
    buyerName: string
    buyerPhone: string
    buyerAddress: string
    buyerNote: string
}

const CartContainer = ({
    groupedItems,
    user,
}: {
    groupedItems: ListGroupedItem
    user: IUserDocument
}) => {
    const router = useRouter()
    const [product, setProduct] = useState<ListGroupedItem>(groupedItems)
    const [open, setOpen] = useState<string | null>(null)
    /** Loading delete */
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>({ mode: "onChange" })

    const handleQuantityChange = (sellerId: string, itemIndex: number, newQuantity: number) => {
        if (newQuantity === 0) return
        setProduct((prevProduct) => {
            const updatedProduct = { ...prevProduct }
            updatedProduct[sellerId].items[itemIndex].quantity = newQuantity
            return updatedProduct
        })
    }

    const handleRemoveItem = async (sellerId: string, itemIndex: number) => {
        try {
            setLoadingDelete(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/delete-cart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    productId: product[sellerId].items[itemIndex].product._id.toString(),
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success) {
                setProduct((prevProduct) => {
                    const updatedProduct = { ...prevProduct }
                    updatedProduct[sellerId].items.splice(itemIndex, 1)
                    if (updatedProduct[sellerId].items.length === 0) {
                        delete updatedProduct[sellerId]
                    }
                    return updatedProduct
                })
            }
        } catch (error) {
            console.error("Failed to remove item: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Failed to remove item")
        } finally {
            setLoadingDelete(false)
        }
    }

    const calculateTotal = (items: { quantity: number; price: number }[]) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const onSubmit = async (data: FormValues, sellerId: string) => {
        // Tạo orderCode
        let orderCodeNumber = Math.floor(Math.random() * 100001)
        // Lấy các items
        const items = product[sellerId].items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }))
        // Data Checkout
        const checkoutData = {
            orderCode: orderCodeNumber,
            amount: calculateTotal(product[sellerId].items),
            description: `Thanh toan ${orderCodeNumber}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_YOUR_URL}/store/cart`,
            returnUrl: `${process.env.NEXT_PUBLIC_YOUR_URL}/store`,
            items: items,
            buyerName: data.buyerName,
            buyerEmail: user.email,
            buyerPhone: data.buyerPhone,
            buyerAddress: data.buyerAddress,
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create-payment-link`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        sellerId,
                        checkoutData,
                        buyerNote: watch("buyerNote"),
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
                setContentSnackbar(data.message)
            }
            if (data.success) {
                router.push(data.data)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        }
    }

    return (
        <>
            {Object.keys(product).length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    Hiện tại chưa có sản phẩm nào
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {Object.entries(product).map(([sellerId, group], index) => {
                        const total = calculateTotal(group.items)

                        return (
                            <div key={index} className="border rounded-lg p-2">
                                <div className="text-base font-semibold text-brown-1">
                                    Sản phẩm được bán bởi {group.seller.username}:
                                </div>
                                <div className="flex flex-col gap-4 mt-2">
                                    {group.items.map((item, itemIndex) => (
                                        <CartItem
                                            key={itemIndex}
                                            item={item}
                                            onDecrease={() =>
                                                handleQuantityChange(
                                                    sellerId,
                                                    itemIndex,
                                                    item.quantity - 1,
                                                )
                                            }
                                            onIncrease={() =>
                                                handleQuantityChange(
                                                    sellerId,
                                                    itemIndex,
                                                    item.quantity + 1,
                                                )
                                            }
                                            onRemove={() => handleRemoveItem(sellerId, itemIndex)}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 text-right text-base font-semibold text-brown-1">
                                    Tổng: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        className="mt-4 p-1 flex gap-2 items-center bg-gradient-to-tr from-pink-1 to-yellow-50 text-brown-1 text-sm border-2 border-brown-1 transition-all hover:translate-x-1"
                                        onClick={() => setOpen(sellerId)}
                                    >
                                        Thanh toán <MoveRight className="w-4" />
                                    </Button>
                                </div>
                                <Dialog open={open === sellerId} onOpenChange={() => setOpen(null)}>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <form
                                            onSubmit={handleSubmit((formData) =>
                                                onSubmit(formData, sellerId),
                                            )}
                                        >
                                            <DialogHeader>
                                                <DialogTitle>Thông tin người mua hàng</DialogTitle>
                                                <DialogDescription>
                                                    Hãy điền chi tiết các thông tin của bạn, đơn
                                                    hàng của bạn sẽ được người bán gửi đi dựa trên
                                                    những thông tin bạn cung cấp.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-2">
                                                <div className="text-sm">
                                                    Tổng giá trị đơn hàng:{" "}
                                                    {total
                                                        .toString()
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    đ
                                                </div>
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label htmlFor="buyerName">
                                                        Tên người mua hàng{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        {...register("buyerName", {
                                                            required: "Bạn cần điền tên người mua",
                                                        })}
                                                        type="text"
                                                        id="buyerName"
                                                        className="p-1 border focus:outline-none border-brown-1 rounded-lg"
                                                    />
                                                    {errors.buyerName && (
                                                        <span className="text-xs text-red-500">
                                                            {errors.buyerName.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label htmlFor="buyerPhone">
                                                        Số điện thoại{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        {...register("buyerPhone", {
                                                            required: "Bạn cần điền số điện thoại",
                                                            pattern: {
                                                                value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                                                message:
                                                                    "Số điện thoại không hợp lệ",
                                                            },
                                                        })}
                                                        type="text"
                                                        id="buyerPhone"
                                                        className="p-1 border focus:outline-none border-brown-1 rounded-lg"
                                                    />
                                                    {errors.buyerPhone && (
                                                        <span className="text-xs text-red-500">
                                                            {errors.buyerPhone.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label htmlFor="buyerAddress">
                                                        Địa chỉ{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        {...register("buyerAddress", {
                                                            required:
                                                                "Bạn cần điền địa chỉ mua hàng",
                                                        })}
                                                        id="buyerAddress"
                                                        rows={5}
                                                        className="p-1 border focus:outline-none border-brown-1 rounded-lg resize-none"
                                                    />
                                                    {errors.buyerAddress && (
                                                        <span className="text-xs text-red-500">
                                                            {errors.buyerAddress.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 text-sm">
                                                    <label htmlFor="buyerNote">Ghi chú</label>
                                                    <textarea
                                                        {...register("buyerNote")}
                                                        id="buyerNote"
                                                        rows={3}
                                                        className="p-1 border focus:outline-none border-brown-1 rounded-lg resize-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="text-sm font-semibold text-brown-1">
                                                    Các sản phẩm:
                                                </div>
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {group.items.map((item, itemIndex) => (
                                                        <div
                                                            key={itemIndex}
                                                            className="flex justify-between text-xs"
                                                        >
                                                            <div>
                                                                {item.name} x {item.quantity}
                                                            </div>
                                                            <div>
                                                                {(item.price * item.quantity)
                                                                    .toString()
                                                                    .replace(
                                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                                        ".",
                                                                    )}
                                                                đ
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <DialogFooter className="mt-10">
                                                <Button onClick={() => setOpen(null)}>Hủy</Button>
                                                <Button type="submit">Xác nhận</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )
                    })}
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

export default CartContainer
