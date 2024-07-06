import ListPostAdmin from "@/components/shared/list-post-admin"
import { fetchPost, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import React from "react"

export const metadata = {
    title: "Quản lý hệ thống Pet Paradise",
    description: "Generated by Next.js",
}

const ManagePost = async () => {
    const [user, posts] = await Promise.all([fetchUser(), fetchPost()])

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
                        <div className="font-semibold text-3xl">Quản lý bài đăng</div>
                        <div>Quản lý các bài đăng trên hệ thống</div>
                    </div>
                    {/* {otherUser === null || otherUser.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-brown-1">
                            Hiện tại không có người dùng nào khác
                        </div>
                    ) : (
                        <ListOtherUserAdmin otherUser={otherUser} />
                    )} */}
                    {posts === null || posts.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-brown-1">
                            Hiện tại không có bài viết nào
                        </div>
                    ) : (
                        <ListPostAdmin posts={posts} user={user} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagePost
