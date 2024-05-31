import ShopContainer from "@/components/container/shop-container"
import { fetchProduct, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Store",
    description: "Generated by Next.js",
}

const Store = async () => {
    const [user, products] = await Promise.all([fetchUser(), fetchProduct()])

    if (!user) {
        redirect(`/login`)
    }

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Cửa hàng thú cưng</div>
                    </div>
                    <ShopContainer user={user} products={products} />
                </div>
            </div>
        </div>
    )
}

export default Store
