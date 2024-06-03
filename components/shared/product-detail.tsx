"use client"

import { convertISOToFormatNotHours } from "@/lib/utils"
import { ICartItem, IProductDocument, IUserDocument } from "@/types"
import Favorite from "@mui/icons-material/Favorite"
import {
    ArrowLeft,
    CircleChevronLeft,
    CircleChevronRight,
    Loader2,
    Pencil,
    ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"

const typePetToText = {
    food: "Đồ ăn",
    toys: "Đồ chơi",
    medicine: "Thuốc",
    accessories: "Phụ kiện",
    housing: "Nhà ở",
    training: "Huấn luyện",
    other: "Khác",
}

const ProductDetail = ({ product, user }: { product: IProductDocument; user: IUserDocument }) => {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    // Sale of products
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false)
    const [discountedPrice, setDiscountedPrice] = useState<number>(product.price)
    // Cart
    const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false)
    const [cart, setCart] = useState<ICartItem[]>([])
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

    const handleAddProductToCart = async () => {
        try {
            setLoadingAddProduct(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/add-cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product._id.toString(),
                }),
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success) {
                setCart(data.data as ICartItem[])
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar("Sản phẩm đã được thêm vào giỏ hàng")
            }
        } catch (error) {
            console.error("Failed to add product: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Failed to add product")
        } finally {
            setLoadingAddProduct(false)
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

    useEffect(() => {
        try {
            const fetchCart = async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/cart`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
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
                }
                if (data.success) {
                    setCart(data.data as ICartItem[])
                }
            }
            fetchCart()
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-2 text-brown-1 transition-all hover:-translate-x-2">
                        <Link href={"/store"}>
                            <ArrowLeft />
                        </Link>
                    </div>
                    <div className="flex pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Chi tiết sản phẩm</div>
                    </div>
                    <div className="flex gap-4 rounded-2xl text-brown-1 hover:cursor-pointer items-center mb-8 justify-end">
                        <div className="flex gap-2 items-center">
                            <ShoppingCart className="transition-all hover:-translate-y-1.5 w-10 h-10" />
                            <div className="text-sm font-medium">{`(${cart.length})`}</div>
                        </div>
                        {user._id.toString() === product.seller._id.toString() && (
                            <Link href={`/store/edit-product/${product._id.toString()}`}>
                                <Pencil className="transition-all hover:-translate-y-1.5 w-8 h-8" />
                            </Link>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-2xl font-semibold text-brown-1">{product.name}</div>
                        <div className="rounded-full cursor-pointer bg-slate-100 p-1">
                            <Favorite style={{ fontSize: "24px", color: "red" }} />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col md:flex-row gap-4 my-8">
                        <div className="overflow-hidden rounded-lg mb-4 max-w-[300px] border border-brown-1">
                            <div
                                className="flex transition-transform duration-500"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {/* Sử dụng flex-shrik-0 để đảm bảo cho các ảnh còn lại bằng 0 so với ảnh hiện tại */}
                                {product.images.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="relative flex-shrink-0 w-full flex items-center p-2"
                                    >
                                        <Image
                                            src={photo}
                                            alt="work"
                                            className="hover:scale-110 transition-all duration-500 rounded-lg"
                                            width={500}
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
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            {isDiscounted ? (
                                <>
                                    <div className="line-through">
                                        Giá sản phẩm:{" "}
                                        {product.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        đ
                                    </div>
                                    <div>
                                        Giá sản phẩm khuyến mãi:{" "}
                                        {discountedPrice
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        đ
                                    </div>
                                </>
                            ) : (
                                <div>
                                    Giá sản phẩm:{" "}
                                    {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    đ
                                </div>
                            )}

                            {isDiscounted && (
                                <>
                                    {/* <div>Giảm giá : {product.discountRate}%</div> */}
                                    <div>
                                        Thời gian giảm giá bắt đầu từ:{" "}
                                        {convertISOToFormatNotHours(product.discountStartDate)} đến
                                        hết ngày{" "}
                                        {convertISOToFormatNotHours(product.discountEndDate)}
                                    </div>
                                </>
                            )}

                            <div>Loại sản phẩm: {typePetToText[product.productType]}</div>
                            <div>Số lượng sản phẩm: {product.stock}</div>
                            <div>Người bán: {product.seller.username}</div>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col text-sm gap-2 mt-8">
                        <div className="font-semibold">Mô tả sản phẩm</div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: product.description.replace(/\n/g, "<br />"),
                            }}
                        />
                    </div>
                    <div className="mt-8">
                        <Button
                            className="flex gap-1 hover:opacity-60"
                            onClick={handleAddProductToCart}
                            disabled={loadingAddProduct}
                        >
                            {loadingAddProduct ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart />
                                    Thêm vào giỏ hàng
                                </>
                            )}
                        </Button>
                    </div>
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

export default ProductDetail
