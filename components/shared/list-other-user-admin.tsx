"use client"

import { IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import UserCardManage from "./user-card-manage"
import { useInView } from "react-intersection-observer"
import { USER_PER_PAGE } from "@/lib/data"

const ListOtherUserAdmin = ({ otherUser }: { otherUser: IUserDocument[] }) => {
    const router = useRouter()
    /** List user other */
    const [listUser, setListUser] = useState<IUserDocument[]>(otherUser)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Load more */
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState(true)
    /** Intersection Observer */
    const { ref, inView } = useInView()

    const fetchMoreUser = useCallback(() => {
        setPage((prevPage) => prevPage + 1)
    }, [])

    useEffect(() => {
        async function loadMoreData() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/other?limit=${USER_PER_PAGE}&offset=${
                    page * USER_PER_PAGE
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success && data.data.length) {
                const newUser = data.data.otherUsers.filter(
                    (user: IUserDocument) => !listUser.some((u) => u._id === user._id),
                )
                setListUser((prev) => [...prev, ...newUser])
                setHasMore(data.data.otherUsers.length > 0)
            } else {
                setHasMore(false)
            }
        }

        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreUser()
        }
    }, [inView])

    return (
        <>
            <div className="flex flex-col gap-8">
                {otherUser.map((people: IUserDocument) => (
                    <UserCardManage key={people._id.toString()} people={people} />
                ))}
            </div>
            <div ref={ref}></div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default ListOtherUserAdmin
