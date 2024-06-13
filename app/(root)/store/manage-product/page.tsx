import ManageProductContainer from "@/components/container/manager-product-container"
import { fetchProductByUser, fetchUser } from "@/lib/fetch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Quản lý sản phẩm của bạn",
    description: "Generated by Next.js",
}

const ManageProduct = async () => {
    const user = await fetchUser()

    if (!user) {
        redirect("/login")
    }

    const products = await fetchProductByUser({ userId: user._id.toString() })

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-2 text-brown-1 transition-all hover:-translate-x-2">
                        <Link href={`/store`}>
                            <ArrowLeft />
                        </Link>
                    </div>
                    <div className="flex pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Quản lý sản phẩm</div>
                    </div>
                    <ManageProductContainer products={products} user={user} />
                </div>
            </div>
        </div>
    )
}

export default ManageProduct
