"use client"

import { IChatDocument, IUserDocument } from "@/types"
import React, { useEffect, useState } from "react"
import MessageCard from "./message-card"
import { pusherClient } from "@/lib/pusher"

const ListMessageCard = ({ chats, user }: { chats: IChatDocument[]; user: IUserDocument }) => {
    const [listChat, setListChat] = useState<IChatDocument[]>(chats)

    useEffect(() => {
        if (user) {
            pusherClient.subscribe(user._id.toString())

            const handleNewChat = (newChat: IChatDocument) => {
                setListChat((allChats) => [newChat, ...allChats])
            }

            pusherClient.bind("new-chat", handleNewChat)

            return () => {
                pusherClient.unsubscribe(user._id.toString())
                pusherClient.unbind("new-chat", handleNewChat)
            }
        }
    }, [user])

    return (
        <>
            {listChat.map((chat) => (
                <MessageCard key={chat._id} chat={chat} user={user} />
            ))}
        </>
    )
}

export default ListMessageCard
