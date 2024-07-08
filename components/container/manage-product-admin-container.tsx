import React, { useCallback, useEffect, useState } from "react"
import MenuShop from "../shared/menu-shop"
import { useInView } from "react-intersection-observer"
import { IProductDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import { PRODUCT_PER_PAGE } from "@/lib/data"
import ItemCardSkeleton from "../skeleton/item-card-skeleton"
import { Loader2 } from "lucide-react"
import SnackbarCustom from "../ui/snackbar"
import ItemCard from "../shared/item-card"

const ManageProductAdminContainer = ({
    products,
    user,
}: {
    products: IProductDocument[] | null
    user: IUserDocument
}) => {
    const router = useRouter()
    const [activeMenu, setActiveMenu] = useState<string>("all")
    // List product
    const [listProduct, setListProduct] = useState<IProductDocument[]>(!products ? [] : products)
    // Loading card
    const [loadingCard, setLoadingCard] = useState<boolean>(false)
    // Load more
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadingMoreData, setLoadingMoreData] = useState<boolean>(false)
    const { ref, inView } = useInView()
    // Snack Bar
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleDelete = (productId: string) => {
        const tmp = listProduct?.filter((product) => product._id.toString() !== productId)
        if (tmp) setListProduct(tmp)
    }

    const fetchMorePosts = useCallback(() => {
        setPage((prev) => prev + 1)
    }, [])

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
                        setContentSnackbar(data.message || "Xảy ra lỗi khi tải thêm dữ liệu")
                        return
                    }
                    if (data.success) {
                        setListProduct(data.data.products as IProductDocument[])
                    }
                } catch (error) {
                    console.error("Failed to fetch data: ", error)
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar("Xảy ra lỗi khi tải thêm dữ liệu")
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
                    setContentSnackbar(data.message || "Xảy ra lỗi khi tải thêm dữ liệu")
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
                setContentSnackbar("Xảy ra lỗi khi tải thêm dữ liệu")
            } finally {
                setLoadingMoreData(false)
            }
        }
        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMorePosts()
        }
    }, [inView])

    return (
        <div className="pb-10">
            <MenuShop activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            {loadingCard ? (
                <>
                    <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                        {Array.from({ length: 4 })?.map((_, index) => (
                            <ItemCardSkeleton key={index} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {listProduct.length === 0 ? (
                        <div className="w-full pt-10 flex items-center justify-center text-brown-1">
                            Hiện tại không có sản phẩm nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                            {listProduct?.map((product, index) => (
                                <ItemCard
                                    key={index}
                                    product={product}
                                    userByFetch={user}
                                    manage={true}
                                    admin={true}
                                    handleDelete={handleDelete}
                                />
                            ))}
                            <div ref={ref} className="w-full flex justify-center">
                                {loadingMoreData && <Loader2 className="w-8 h-8 animate-spin" />}
                            </div>
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
        </div>
    )
}

export default ManageProductAdminContainer
