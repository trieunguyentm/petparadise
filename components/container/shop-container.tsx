"use client"

import ItemCard from "@/components/shared/item-card"
import MenuShop from "@/components/shared/menu-shop"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ICartItem, IProductDocument, IUserDocument } from "@/types"
import { Loader2, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import ItemCardSkeleton from "../skeleton/item-card-skeleton"
import { useInView } from "react-intersection-observer"
import { PRODUCT_PER_PAGE } from "@/lib/data"

const ShopContainer = ({
    user,
    products,
}: {
    user: IUserDocument
    products: IProductDocument[] | null
}) => {
    const router = useRouter()
    const [activeMenu, setActiveMenu] = useState<string>("all")
    const [listProduct, setListProduct] = useState<IProductDocument[]>(!products ? [] : products)
    const [loadingCard, setLoadingCard] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    // Load more
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadingMoreData, setLoadingMoreData] = useState<boolean>(false)
    const { ref, inView } = useInView()
    // Cart
    const [cart, setCart] = useState<ICartItem[]>([])

    useEffect(() => {
        setPage(0)
        setHasMore(true)
        if (activeMenu === "all") {
            setListProduct(!products ? [] : products)
        } else {
            const fetchProductByCategory = async () => {
                setLoadingCard(true)
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product?productType=${activeMenu}`,
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
                        setListProduct(data.data.products as IProductDocument[])
                    }
                } catch (error) {
                    console.error("Failed to fetch data: ", error)
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar("Failed to fetch more data")
                } finally {
                    setLoadingCard(false)
                }
            }
            fetchProductByCategory()
        }
    }, [activeMenu])

    useEffect(() => {
        async function loadMoreData() {
            setLoadingMoreData(true)
            try {
                if (!listProduct) return
                let endPointURL = `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/product?limit=${PRODUCT_PER_PAGE}&offset=${page * PRODUCT_PER_PAGE}`
                if (activeMenu !== "all") {
                    endPointURL = endPointURL + `&productType=${activeMenu}`
                }
                const res = await fetch(endPointURL, {
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
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar(data.message || "Error loading more posts")
                    return
                }
                if (data.success && data.data.products?.length > 0) {
                    const newProduct = data.data.products.filter(
                        (product: IProductDocument) =>
                            !listProduct?.some((p) => p._id.toString() === product._id.toString()),
                    )
                    const tmp = [...listProduct, ...newProduct]
                    setListProduct(tmp)
                    setHasMore(data.data.products?.length > 0)
                } else {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch more data")
            } finally {
                setLoadingMoreData(false)
            }
        }
        if (page > 0) loadMoreData()
    }, [page])

    const fetchMorePosts = useCallback(() => {
        setPage((prev) => prev + 1)
    }, [])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMorePosts()
        }
    }, [inView])

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
        <>
            <div className="flex justify-between">
                <div className="relative border-brown-1 border-2 p-3 pr-10 rounded-2xl">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm ..."
                        className="focus:outline-none text-sm"
                    />
                    <Search className="absolute right-3 top-3 text-brown-1 hover:cursor-pointer transition-all hover:-translate-y-1.5" />
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex gap-2 items-center text-brown-1">
                        <ShoppingCart className="transition-all hover:-translate-y-1.5 w-10 h-10 text-brown-1" />
                        <div className="text-sm font-medium">{`(${cart.length})`}</div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar className="hover:cursor-pointer transition-all hover:-translate-y-1.5">
                                <AvatarImage
                                    src={user.profileImage || "/assets/images/avatar.jpeg"}
                                    alt="@avatar"
                                />
                                <AvatarFallback>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={"/store/create-product"}>Tạo sản phẩm</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/store/manage-product"}>Quản lý sản phẩm</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/store/favorite-product"}>Sản phẩm yêu thích</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/store/manage-order"}>Quản lý đơn hàng</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <MenuShop activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            {loadingCard ? (
                <>
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                        {Array.from({ length: 4 })?.map((_, index) => (
                            <ItemCardSkeleton key={index} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {listProduct.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            Hiện tại không có sản phẩm nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                            {listProduct?.map((product, index) => (
                                <ItemCard key={index} product={product} userByFetch={user} />
                            ))}
                        </div>
                    )}
                </>
            )}
            <div ref={ref} className="w-full flex justify-center">
                {loadingMoreData && <Loader2 className="w-8 h-8 animate-spin" />}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default ShopContainer
