import React, { useEffect, useRef, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import Image from "next/image"
import { MESSAGE_PER_PAGE } from "@/lib/data"
import { IMessageDocument, IUserDocument } from "@/types"
import { format } from "date-fns"
import { pusherClient } from "@/lib/pusher"
import AreaConversationSkeleton from "../skeleton/area-conversation-skeleton"

const AreaConversation = ({ chatId, user }: { chatId: string; user: IUserDocument }) => {
    const [page, setPage] = useState<number>(0)
    const [loadingMessage, setLoadingMessage] = useState<boolean>(true)
    const [listMessage, setListMessage] = useState<IMessageDocument[]>([])
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleNewMessage = async (newMessage: IMessageDocument) => {
        setListMessage((prevListMessage) => [...prevListMessage, newMessage])
    }
    /** Scrolling down to the bottom when having the new message */
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function loadMessage() {
            setLoadingMessage(true)
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/chat/${chatId}/messages?limit=${MESSAGE_PER_PAGE}&offset=${
                        page * MESSAGE_PER_PAGE
                    }`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    },
                )
                const data = await res.json()
                if (!res.ok) {
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar(data.message || "Error loading message")
                    return
                }
                const messages: IMessageDocument[] = data.data
                setListMessage(messages.reverse())
            } catch (error) {
                console.error("Failed to fetch message: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch message")
            } finally {
                setLoadingMessage(false)
            }
        }
        loadMessage()
    }, [])

    useEffect(() => {
        pusherClient.subscribe(chatId)
        pusherClient.bind("new-message", handleNewMessage)

        return () => {
            pusherClient.unsubscribe(chatId)
            pusherClient.unbind("new-message", handleNewMessage)
        }
    }, [chatId])

    useEffect(() => {
        const handleSeenChat = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${chatId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })
                const data = await res.json()
                if (!res.ok) {
                    console.log(res.text)
                }
            } catch (error) {
                console.log(error)
            }
        }
        handleSeenChat()
    }, [chatId, listMessage])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [listMessage])

    return (
        <>
            {loadingMessage ? (
                <AreaConversationSkeleton />
            ) : (
                <>
                    <div className="flex flex-1 overflow-scroll w-full">
                        <div className="flex flex-col gap-4 overflow-scroll py-8 w-full">
                            {listMessage.map((message) => {
                                return message.sender._id !== user._id ? (
                                    <div key={message._id} className="flex gap-3 items-start">
                                        <Image
                                            src={
                                                message.sender.profileImage ||
                                                "/assets/images/avatar.jpeg"
                                            }
                                            alt="profile-photo"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-medium">
                                                {message.sender.username}&#160;&#183;&#160;
                                                {format(new Date(message?.createdAt), "p")}
                                            </p>
                                            <p className="w-fit max-w-[80%] bg-slate-100 px-2 py-1 rounded-md text-sm">
                                                {message?.text}
                                                {message.photo && (
                                                    <Image
                                                        src={message.photo}
                                                        alt="photo"
                                                        width={1000}
                                                        height={1000}
                                                        className="rounded-md"
                                                    />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={message._id}
                                        className="flex gap-3 items-start justify-end"
                                    >
                                        <div className="flex flex-col gap-2 items-end">
                                            <p className="text-sm font-medium">
                                                {message.sender.username}&#160;&#183;&#160;
                                                {format(new Date(message?.createdAt), "p")}
                                            </p>

                                            <p className="w-fit max-w-[80%] bg-purple-400 px-2 py-1 rounded-md text-sm">
                                                {message?.text}
                                                {message.photo && (
                                                    <Image
                                                        src={message.photo}
                                                        alt="photo"
                                                        width={1000}
                                                        height={1000}
                                                        className="rounded-md"
                                                    />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                    <SnackbarCustom
                        open={openSnackbar}
                        setOpen={setOpenSnackbar}
                        type={typeSnackbar}
                        content={contentSnackbar}
                    />
                </>
            )}
        </>
    )
}

export default AreaConversation
