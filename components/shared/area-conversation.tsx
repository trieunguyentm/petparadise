import React, { useEffect, useRef, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import Image from "next/image"
import { MESSAGE_PER_PAGE } from "@/lib/data"
import { IMessageDocument, IUserDocument } from "@/types"
import { format } from "date-fns"
import { pusherClient } from "@/lib/pusher"
import AreaConversationSkeleton from "../skeleton/area-conversation-skeleton"
import { useInView } from "react-intersection-observer"
import { useRouter } from "next/navigation"

const AreaConversation = ({ chatId, user }: { chatId: string; user: IUserDocument }) => {
    const router = useRouter()
    const [page, setPage] = useState<number>(0)
    const [loadingMessage, setLoadingMessage] = useState<boolean>(true)
    const [listMessage, setListMessage] = useState<IMessageDocument[]>([])
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    /** Infinite Scroll */
    const { ref, inView } = useInView()
    const [hasMore, setHasMore] = useState<boolean>(true)

    const handleNewMessage = async (newMessage: IMessageDocument) => {
        setListMessage((prevListMessage) => [...prevListMessage, newMessage])
    }
    /** Scrolling down to the bottom when having the new message */
    const bottomRef = useRef<HTMLDivElement>(null)

    async function loadMessage() {
        /** Lần đầu loading với page = 0 thì setLoadingMessage tạo Skeleton */
        if (page === 0) {
            setLoadingMessage(true)
        }
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
                if (data.type === "ERROR_SESSION") {
                    // Lưu thông báo vào localStorage
                    localStorage.setItem(
                        "toastMessage",
                        JSON.stringify({ type: "error", content: data.message }),
                    )
                    router.push("/login")
                    return
                }
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message || "Error loading message")
                return
            }
            const messages: IMessageDocument[] = data.data.reverse()
            /** Nếu không tìm được dữ liệu nào thì setHasMore(false) để báo rằng không có message */
            if (messages.length === 0) {
                setHasMore(false)
            }
            /** Nối tin nhắn */
            setListMessage((prevMessages) => [...messages, ...prevMessages])
        } catch (error) {
            console.error("Failed to fetch message: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Failed to fetch message")
        } finally {
            if (page === 0) {
                setLoadingMessage(false)
            }
        }
    }

    useEffect(() => {
        loadMessage()
    }, [page])

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
                    if (data.type === "ERROR_SESSION") {
                        // Lưu thông báo vào localStorage
                        localStorage.setItem(
                            "toastMessage",
                            JSON.stringify({ type: "error", content: data.message }),
                        )
                        router.push("/login")
                        return
                    }
                    // console.log(res.text)
                }
            } catch (error) {
                console.log(error)
            }
        }
        handleSeenChat()
    }, [chatId, listMessage])

    useEffect(() => {
        /** Chỉ xuống cuối khi lần đầu load vào trang, tức page = 0 */
        if (listMessage.length > 0 && page === 0) {
            bottomRef.current?.scrollIntoView()
        }
    }, [listMessage])

    useEffect(() => {
        if (inView && hasMore && bottomRef.current !== null) {
            setPage((prev) => prev + 1)
        }
    }, [inView])

    return (
        <>
            {loadingMessage ? (
                <AreaConversationSkeleton />
            ) : (
                <>
                    <div className="flex flex-1 overflow-scroll w-full">
                        <div className="flex flex-col gap-4 overflow-scroll py-8 w-full px-4">
                            {listMessage.map((message, index) => {
                                let indexRef = 0
                                if (listMessage.length >= MESSAGE_PER_PAGE) {
                                    indexRef = 8
                                }
                                return message.sender._id !== user._id ? (
                                    <div
                                        ref={index === indexRef ? ref : null}
                                        key={message._id}
                                        className="flex gap-3 items-start"
                                    >
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
                                        ref={index === indexRef ? ref : null}
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
