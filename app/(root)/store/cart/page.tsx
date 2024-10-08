import CartContainer from "@/components/container/cart-container"
import Link from "next/link"
import { fetchCart, fetchUser } from "@/lib/fetch"
import { IProductDocument, IUserDocument } from "@/types"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Giỏ hàng",
    description: "Generated by Next.js",
}

export type ListGroupedItem = {
    [key: string]: {
        seller: IUserDocument
        items: {
            name: string
            quantity: number
            price: number
            product: IProductDocument
        }[]
    }
}

const CartStore = async () => {
    const [user, cart] = await Promise.all([fetchUser(), fetchCart()])

    if (!user) {
        redirect(`/login`)
    }

    const groupItemsBySeller = () => {
        if (cart) {
            return cart.reduce((acc, item) => {
                const sellerId = item.product.seller._id.toString()
                if (!acc[sellerId]) {
                    acc[sellerId] = {
                        seller: item.product.seller,
                        items: [],
                    }
                }

                // Kiểm tra khuyến mãi
                const currentDate = new Date()
                let price = item.product.price
                if (
                    item.product.discountRate &&
                    item.product.discountStartDate &&
                    item.product.discountEndDate
                ) {
                    const discountStart = new Date(item.product.discountStartDate)
                    const discountEnd = new Date(item.product.discountEndDate)
                    if (currentDate >= discountStart && currentDate <= discountEnd) {
                        price =
                            item.product.price -
                            item.product.price * (item.product.discountRate / 100)
                    }
                }

                acc[sellerId].items.push({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: price,
                    product: item.product,
                })
                return acc
            }, {} as { [key: string]: { seller: IUserDocument; items: { name: string; quantity: number; price: number; product: IProductDocument }[] } })
        } else {
            return {}
        }
    }

    const groupedItems = groupItemsBySeller()

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
                        <div className="font-semibold text-3xl">Giỏ hàng</div>
                    </div>
                    <CartContainer groupedItems={groupedItems} user={user} />
                </div>
            </div>
        </div>
    )
}

export default CartStore
