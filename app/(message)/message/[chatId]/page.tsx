import MessageDetailContainer from "@/components/container/message-detail-container"
import { fetchChatByUser, fetchDetailChat, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import React from "react"

export const metadata = {
    title: "Tin nhắn",
    description: "Generated by Next.js",
}

const DetailMessagePage = async ({ params }: { params: { chatId: string } }) => {
    const chatId = params.chatId
    const [chatDetail, user, chats] = await Promise.all([
        fetchDetailChat({ chatId }),
        fetchUser(),
        fetchChatByUser(),
    ])

    if (!user) {
        redirect("/login")
    }

    if (!chatDetail) {
        redirect("/message")
    }

    return <MessageDetailContainer chatDetail={chatDetail} user={user} chats={chats} />
}

export default DetailMessagePage
