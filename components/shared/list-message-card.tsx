"use client"

import { IChatDocument, IUserDocument } from "@/types"
import React, { useEffect, useState } from "react"
import MessageCard from "./message-card"
import { pusherClient } from "@/lib/pusher"

const ListMessageCard = ({
    chats,
    user,
    search,
}: {
    chats: IChatDocument[]
    user: IUserDocument
    search: string
}) => {
    const [listChat, setListChat] = useState<IChatDocument[]>(chats)

    useEffect(() => {
        if (user) {
            pusherClient.subscribe(user._id.toString())

            const handleNewChat = (newChat: IChatDocument) => {
                setListChat((allChats) => [newChat, ...allChats])
            }

            const handleUpdateChat = (updatedChat: IChatDocument) => {
                setListChat((prevListChat) => {
                    const newListChat = prevListChat.filter(
                        (item) => item._id.toString() !== updatedChat._id.toString(),
                    )
                    return [updatedChat, ...newListChat]
                })
            }

            const handleSeenChat = (updatedChat: IChatDocument) => {
                setListChat((prevListChat) => {
                    const newListChat = prevListChat.map((chatItem) =>
                        chatItem._id.toString() === updatedChat._id.toString()
                            ? updatedChat
                            : chatItem,
                    )
                    return newListChat
                })
            }

            pusherClient.bind("new-chat", handleNewChat)
            pusherClient.bind("update-chat", handleUpdateChat)
            pusherClient.bind("seen-chat", handleSeenChat)

            return () => {
                pusherClient.unsubscribe(user._id.toString())
                pusherClient.unbind("new-chat", handleNewChat)
                pusherClient.unbind("update-chat", handleUpdateChat)
                pusherClient.unbind("seen-chat", handleSeenChat)
            }
        }
    }, [user])

    return (
        <>
            {listChat.map((chat) => (
                <MessageCard key={chat._id} chat={chat} user={user} search={search} />
            ))}
        </>
    )
}

export default ListMessageCard
