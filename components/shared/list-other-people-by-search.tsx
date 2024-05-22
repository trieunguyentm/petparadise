"use client"

import { IUserDocument } from "@/types"
import React, { useCallback, useEffect, useState } from "react"
import UserCard from "./user-card"
import { useRouter } from "next/navigation"
import { useInView } from "react-intersection-observer"
import SnackbarCustom from "../ui/snackbar"
import { USER_PER_PAGE } from "@/lib/data"

const ListOtherUserBySearch = ({
    user,
    listPeopleWithOutUser,
    param,
}: {
    user: IUserDocument
    listPeopleWithOutUser: IUserDocument[]
    param: string
}) => {
    const router = useRouter()
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** List User */
    const [listUser, setListUser] = useState<IUserDocument[]>(listPeopleWithOutUser)
    /** Load more */
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState(true)
    /** Intersection Observer */
    const { ref, inView } = useInView()

    const fetchMorePosts = useCallback(() => {
        setPage((prevPage) => prevPage + 1)
    }, [])

    useEffect(() => {
        async function loadMoreData() {
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/user/other/${param}?limit=${USER_PER_PAGE}&offset=${page * USER_PER_PAGE}`,
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
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch more data")
            }
        }

        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMorePosts()
        }
    }, [inView])

    return (
        <div className="flex flex-col gap-8">
            {listUser.map((people: IUserDocument) => (
                <UserCard key={people._id} people={people} user={user} />
            ))}
            <div ref={ref}></div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default ListOtherUserBySearch
