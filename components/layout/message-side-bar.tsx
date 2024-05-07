import Image from "next/image"
import React from "react"
import { fetchChatByUser, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import MessageListConversation from "../shared/message-list-conversation"

const MessageSideBar = async () => {
    const [chats, user] = await Promise.all([fetchChatByUser(), fetchUser()])

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="w-1/5 h-screen overflow-scroll border-x border-brown-1 flex flex-col px-2">
            <div className="max-h-[100vh] flex flex-col py-4 gap-3">
                {/* LIST MESSAGE */}
                <MessageListConversation chats={chats} user={user} />
            </div>
        </div>
    )
}

export default MessageSideBar
