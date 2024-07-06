"use client"

import { IPostDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import PostFeedDetailAdmin from "./post-feed-detail-admin"
import { useInView } from "react-intersection-observer"
import { POST_PER_PAGE } from "@/lib/data"

const ListPostAdmin = ({ posts, user }: { posts: IPostDocument[]; user: IUserDocument }) => {
    const router = useRouter()
    const [listPost, setListPost] = useState<IPostDocument[]>(posts)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

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
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/post?limit=${POST_PER_PAGE}&offset=${
                        page * POST_PER_PAGE
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
                    setContentSnackbar(data.message || "Xảy ra lỗi khi tải thêm dữ liệu")
                    return
                }
                if (data.success && data.data.length) {
                    const newPosts = data.data.filter(
                        (post: IPostDocument) => !listPost.some((p) => p._id === post._id),
                    )
                    setListPost((prev) => [...prev, ...newPosts])
                    setHasMore(data.data.length > 0)
                } else {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Xảy ra lỗi khi tải thêm dữ liệu")
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
        <>
            <div className="flex flex-col gap-10">
                {listPost.map((post, index) => {
                    let indexRef = listPost.length - 1
                    if (listPost.length === 1) indexRef = listPost.length - 1
                    else if (listPost.length > 1 && listPost.length < 10)
                        indexRef = listPost.length - 2
                    else indexRef = listPost.length - 3
                    return (
                        <div key={post._id} ref={index === indexRef ? ref : null}>
                            <PostFeedDetailAdmin
                                post={post}
                                user={user}
                                setListPost={setListPost}
                            />
                        </div>
                    )
                })}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
            {!hasMore && (
                <div className="text-center mt-10">
                    Bạn đã xem hết các bài viết, hãy tải lại trang để tải các bài viết mới nhất
                </div>
            )}
        </>
    )
}

export default ListPostAdmin
