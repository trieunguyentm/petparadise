"use client"

import { IUserDocument } from "@/types"
import MessageContainer from "../container/message-container"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"
import { Loader2 } from "lucide-react"

const MessageListUser = ({ otherUser }: { otherUser: IUserDocument[] | null }) => {
    const router = useRouter()
    const [search, setSearch] = useState<string>("")
    const [listUser, setListUser] = useState<IUserDocument[] | null>(otherUser)
    const [loading, setLoading] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleChangeSearch = useDebouncedCallback((text: string) => {
        setSearch(text)
    }, 600)

    useEffect(() => {
        if (search.trim() === "") {
            setListUser(otherUser)
            return
        }
        const fetchOtherUserBySearch = async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/other/${search}`,
                    {
                        method: "GET",
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
                    setContentSnackbar(data.message)
                }
                if (data.success) {
                    setListUser(data.data)
                }
            } catch (error) {
                console.log(error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("An error occurred, please try again")
            } finally {
                setLoading(false)
            }
        }
        fetchOtherUserBySearch()
    }, [search])

    return (
        <>
            <div className="w-full border-2 rounded-2xl border-brown-1 px-2 py-3 relative">
                <input
                    type="text"
                    className="w-full py-3 pl-2 pr-8 focus:outline-none bg-transparent text-base"
                    placeholder="Tìm kiếm các liên hệ ..."
                    onChange={(e) => handleChangeSearch(e.target.value)}
                />
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin absolute top-6 right-2 cursor-pointer" />
                ) : (
                    <Image
                        src={"/assets/images/search.svg"}
                        alt="search"
                        width={25}
                        height={25}
                        className="absolute top-6 right-2 cursor-pointer transition-all hover:-translate-y-1.5"
                    />
                )}
            </div>
            <MessageContainer otherUser={listUser} />
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default MessageListUser
