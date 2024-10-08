import { fetchProduct, fetchRefundRequest, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import React from "react"
import ManageStoreTab from "@/components/shared/manage-store-admin-tab"

export const metadata = {
    title: "Quản lý hệ thống Pet Paradise",
    description: "Generated by Next.js",
}

const ManageStore = async () => {
    const [user, products, refundRequests] = await Promise.all([
        fetchUser(),
        fetchProduct(),
        fetchRefundRequest(),
    ])

    if (!user) {
        redirect("/login")
    }

    if (user.role !== "admin") {
        redirect("/")
    }

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Quản lý cửa hàng</div>
                        <div>Quản lý các sản phẩm và yêu cầu hoàn tiền sản phẩm từ người dùng</div>
                    </div>
                    <ManageStoreTab
                        products={products}
                        refundRequests={refundRequests}
                        user={user}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManageStore
