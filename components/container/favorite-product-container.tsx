"use client"

import { IProductDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ItemCardSkeleton from "../skeleton/item-card-skeleton"
import ItemCard from "../shared/item-card"

const FavoriteProductContainer = ({ user }: { user: IUserDocument }) => {
    /** Router */
    const router = useRouter()
    /** Loading */
    const [loading, setLoading] = useState<boolean>(true)
    /** Favorite Product */
    const [favoriteProduct, setFavoriteProduct] = useState<IProductDocument[]>([])
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            try {
                setLoading(true)
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/favorite-product`,
                    {
                        method: "GET",
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
                    setContentSnackbar(data.message)
                }
                if (data.success) {
                    setFavoriteProduct(data.data.products as IProductDocument[])
                }
            } catch (error) {
                console.log(error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
            } finally {
                setLoading(false)
            }
        }
        fetchFavoriteProducts()
    }, [])

    return (
        <>
            {loading ? (
                <>
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                        {Array.from({ length: 4 })?.map((_, index) => (
                            <ItemCardSkeleton key={index} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {favoriteProduct.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            Hiện tại không có sản phẩm nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                            {favoriteProduct?.map((product, index) => (
                                <ItemCard key={index} product={product} userByFetch={user} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default FavoriteProductContainer
