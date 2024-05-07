"use client"

import { IChatDocument, IUserDocument } from "@/types"
import ListMessageCard from "./list-message-card"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import Image from "next/image"

const MessageListConversation = ({
    chats,
    user,
}: {
    chats: IChatDocument[] | null
    user: IUserDocument
}) => {
    const [search, setSearch] = useState<string>("")
    // const [listChat, setListChat] = useState<IChatDocument[] | null>(chats)

    const handleChangeSearch = useDebouncedCallback((text: string) => {
        setSearch(text)
    }, 600)

    return (
        <>
            {/* INPUT */}
            <div className="bg-pink-1 py-2 pl-2 pr-8 rounded-xl relative border border-brown-1">
                <input
                    type="text"
                    placeholder="Seach conversation..."
                    className="focus:outline-none py-2 px-1 bg-transparent"
                    onChange={(e) => handleChangeSearch(e.target.value)}
                />
                <Image
                    src={"/assets/images/search.svg"}
                    alt="search"
                    width={25}
                    height={25}
                    className="absolute top-4 right-2 cursor-pointer"
                />
            </div>
            <div className="flex flex-1 overflow-scroll flex-col gap-4 pt-4 mt-6 border-t border-brown-1">
                {!chats ? (
                    <div className="flex items-center justify-center text-brown-1">
                        You haven't joined any conversations yet, select your friends and message
                        them
                    </div>
                ) : (
                    <ListMessageCard chats={chats} user={user} search={search} />
                )}
            </div>
        </>
    )
}

export default MessageListConversation
