import ListOtherUserAdmin from "@/components/shared/list-other-user-admin"
import { fetchOtherUser, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import React from "react"

export const metadata = {
    title: "Quản lý hệ thống Pet Paradise",
    description: "Generated by Next.js",
}

const ManageUser = async () => {
    const [user, otherUser] = await Promise.all([fetchUser(), fetchOtherUser()])

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
                        <div className="font-semibold text-3xl">Quản lý người dùng</div>
                        <div>Quản lý thông tin cá nhân và tài khoản người dùng</div>
                    </div>
                    {otherUser === null || otherUser.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-brown-1">
                            Hiện tại không có người dùng nào khác
                        </div>
                    ) : (
                        <ListOtherUserAdmin otherUser={otherUser} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageUser
