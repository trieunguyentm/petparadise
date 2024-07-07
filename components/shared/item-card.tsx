"use client"

import { CircleChevronLeft, CircleChevronRight, Loader2, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import { IProductDocument, IUserDocument } from "@/types"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"

const ItemCard = ({
    product,
    userByFetch,
    manage,
    admin,
    handleDelete,
}: {
    product: IProductDocument
    userByFetch: IUserDocument
    manage?: boolean
    admin?: boolean
    handleDelete?: (productId: string) => void
}) => {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false)
    const [discountedPrice, setDiscountedPrice] = useState<number>(product.price)
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [user, setUser] = useState<IUserDocument>(userByFetch)
    // Loading add favorite product
    const [loadingAddFavoriteProduct, setLoadingAddFavoriteProduct] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }

    const handlePrevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length,
        )
    }

    const calculateDiscountedPrice = (price: number, discountRate: number) => {
        return price * (1 - discountRate / 100)
    }

    const handleDeleteProduct = async () => {
        if (!manage || !handleDelete) return
        setLoadingDelete(true)
        try {
            let endPointURL = !admin
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${product._id.toString()}`
                : `${
                      process.env.NEXT_PUBLIC_BASE_URL
                  }/api/admin/delete-product/${product._id.toString()}`
            const res = await fetch(endPointURL, {
                method: "DELETE",
                credentials: "include",
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
                setContentSnackbar(data.message)
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                handleDelete(product._id.toString())
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingDelete(false)
            setOpenDialogDelete(false)
        }
    }

    const handleAddFavoriteProduct = async () => {
        try {
            setLoadingAddFavoriteProduct(true)
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/user/${product._id.toString()}/add-favorite-product`,
                {
                    method: "POST",
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
                setContentSnackbar(data.message || "Xảy ra lỗi")
                return
            }
            if (data.success) {
                setUser(data.data as IUserDocument)
            }
        } catch (error) {
            console.error("Failed to add favorite product: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi khi thêm sản phẩm yêu thích")
        } finally {
            setLoadingAddFavoriteProduct(false)
        }
    }

    useEffect(() => {
        const currentDate = new Date()
        if (
            product.discountRate &&
            product.discountRate > 0 &&
            product.discountStartDate &&
            product.discountEndDate
        ) {
            const startDate = new Date(product.discountStartDate)
            const endDate = new Date(product.discountEndDate)
            if (currentDate >= startDate && currentDate <= endDate) {
                setIsDiscounted(true)
                setDiscountedPrice(calculateDiscountedPrice(product.price, product.discountRate))
            }
        }
    }, [product])

    return (
        <div className="relative p-4 rounded-lg shadow-lg hover:shadow-2xl border-2">
            <div className="w-full overflow-hidden rounded-lg mb-4">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {product.images.map((photo, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-full flex items-center"
                        >
                            <Image
                                src={photo}
                                alt="work"
                                className="w-full h-full hover:scale-110 transition-all duration-500 max-h-[300px]"
                                width={1000}
                                height={200}
                            />
                            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full bg-slate-200 bg-opacity-40 cursor-pointer">
                                <CircleChevronLeft
                                    style={{ fontSize: "15px" }}
                                    onClick={handlePrevImage}
                                />
                            </div>
                            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full bg-slate-200 bg-opacity-40 cursor-pointer">
                                <CircleChevronRight
                                    style={{ fontSize: "15px" }}
                                    onClick={handleNextImage}
                                />
                            </div>
                            {manage === undefined && (
                                <div
                                    className="absolute rounded-full cursor-pointer top-2 right-2 bg-slate-100 p-1"
                                    onClick={handleAddFavoriteProduct}
                                >
                                    {!loadingAddFavoriteProduct && (
                                        <>
                                            {user.favoriteProducts.includes(
                                                product._id.toString(),
                                            ) ? (
                                                <FavoriteIcon
                                                    style={{ fontSize: "24px", color: "red" }}
                                                />
                                            ) : (
                                                <FavoriteBorderIcon style={{ fontSize: "24px" }} />
                                            )}
                                        </>
                                    )}
                                    {loadingAddFavoriteProduct && (
                                        <Loader2
                                            className="animate-spin"
                                            style={{ fontSize: "24px" }}
                                        />
                                    )}
                                </div>
                            )}
                            {manage && manage === true && (
                                <div className="absolute rounded-full cursor-pointer top-2 right-2 bg-slate-100 p-2">
                                    <div className="flex gap-2">
                                        <Trash2
                                            onClick={() => setOpenDialogDelete(true)}
                                            style={{ fontSize: "24px", color: "gray" }}
                                            className="transition-all hover:-translate-y-1"
                                        />
                                        {admin !== true && (
                                            <Link
                                                href={`/store/edit-product/${product._id.toString()}`}
                                            >
                                                <Pencil
                                                    style={{ fontSize: "24px", color: "gray" }}
                                                    className="transition-all hover:-translate-y-1"
                                                />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-start gap-3">
                <div>
                    <Link
                        href={`/store/product-detail/${product._id}`}
                        className="text-base mb-1 font-medium hover:underline cursor-pointer hover:text-brown-1 line-clamp-3 flex-wrap"
                    >
                        {product.name}
                    </Link>
                    <div className="flex items-center gap-2 hover:underline hover:text-brown-1 cursor-pointer">
                        <Image
                            onClick={() => router.push(`/profile/${product.seller.username}`)}
                            src={product.seller.profileImage || "/assets/images/avatar.jpeg"}
                            alt="creator"
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer"
                            style={{ clipPath: "circle()" }}
                        />
                        <span className="text-xs font-medium">{product.seller.username}</span>
                    </div>
                </div>
                <div className="text-xs font-medium p-2 rounded-md bg-slate-200 hover:bg-slate-400 justify-center flex flex-col">
                    {isDiscounted ? (
                        <>
                            <div className="line-through">
                                {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                            </div>
                            <div>
                                {discountedPrice
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                đ
                            </div>
                        </>
                    ) : (
                        <div>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div>
                    )}
                </div>
            </div>
            <AlertDialog open={openDialogDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa sản phẩm này?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Thông tin về sản phẩm sẽ bị xóa vĩnh
                            viễn.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDialogDelete(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct}>
                            {loadingDelete ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                "Tiếp tục"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default ItemCard
