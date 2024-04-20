import Image from "next/image"
import React from "react"
import { fetchChatByUser, fetchUser } from "@/lib/fetch"
import ListMessageCard from "../shared/list-message-card"
import { redirect } from "next/navigation"

const MessageSideBar = async () => {
    const [chats, user] = await Promise.all([fetchChatByUser(), fetchUser()])

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="w-1/5 h-screen overflow-scroll border-x border-brown-1 flex flex-col py-1 px-2">
            <div className="flex flex-col py-4 gap-3">
                {/* INPUT */}
                <div className="bg-pink-1 py-2 pl-2 pr-8 rounded-xl relative border border-brown-1">
                    <input
                        type="text"
                        placeholder="Seach conversation..."
                        className="focus:outline-none py-2 px-1 bg-transparent"
                    />
                    <Image
                        src={"/assets/images/search.svg"}
                        alt="search"
                        width={25}
                        height={25}
                        className="absolute top-4 right-2 cursor-pointer"
                    />
                </div>

                {/* LIST MESSAGE */}
                <div className="flex flex-1 flex-col gap-4 pt-4 mt-6">
                    {!chats ? (
                        <div className="flex items-center justify-center text-brown-1">
                            You haven't joined any conversations yet, select your friends and
                            message them
                        </div>
                    ) : (
                        <ListMessageCard chats={chats} user={user} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageSideBar
