import { IPostDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Flag, Loader2, Settings, Trash2 } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { POST_PER_PAGE } from "@/lib/data"

const PostFeedDetailAdmin = ({
    post,
    user,
    setListPost,
}: {
    post: IPostDocument
    user: IUserDocument
    setListPost: (arg: (prev: IPostDocument[]) => IPostDocument[]) => void
}) => {
    const router = useRouter()
    /** Dialog */
    const [showDialog, setShowDialog] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Loading Delete Post */
    const [loadingDeletePost, setLoadingDeletePost] = useState<boolean>(false)

    const handleDeletePost = async () => {
        try {
            setLoadingDeletePost(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/delete-post/${post._id.toString()}`,
                {
                    method: "DELETE",
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
                setContentSnackbar(data.message || "Xảy ra lỗi khi xóa dữ liệu")
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                // Cập nhật listPost sau khi xóa thành công
                setListPost((prev: IPostDocument[]) =>
                    prev.filter((item) => item._id.toString() !== post._id.toString()),
                )
                setShowDialog(false)
            }
        } catch (error) {
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi khi xóa bài viết")
        } finally {
            setLoadingDeletePost(false)
        }
    }

    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-4 bg-pink-1">
                {/* CAPTION */}
                <div className="bg-white w-full rounded-t-md p-3 border-b">
                    <div className="flex flex-row justify-between items-center pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="cursor-pointer">
                                <AvatarImage
                                    // onClick={() => router.push(`/profile/${post.poster.username}`)}
                                    src={post.poster.profileImage || "/assets/images/avatar.jpeg"}
                                    alt="@avatar"
                                    className="cursor-pointer"
                                />
                                <AvatarFallback>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{post.poster.username}</div>
                                <div
                                    className="text-xs font-thin cursor-pointer"
                                    onClick={() => router.push(`/post/${post._id.toString()}`)}
                                >
                                    {convertISOToFormat(post.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer">
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Settings className="text-brown-1" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setShowDialog(true)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Xóa bài viết</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialog open={showDialog}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Bạn có chắc muốn xóa bài viết?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Sau khi xóa bài viết, bài viết sẽ không thể khôi
                                                phục
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <Button
                                                variant={"destructive"}
                                                onClick={() => setShowDialog(false)}
                                            >
                                                Hủy
                                            </Button>
                                            <Button onClick={handleDeletePost}>
                                                {loadingDeletePost ? (
                                                    <Loader2 className="w-8 h-8 animate-spin" />
                                                ) : (
                                                    "Xóa bài viết"
                                                )}
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        </div>
                    </div>
                    <div
                        className="font-normal text-sm pb-4"
                        dangerouslySetInnerHTML={{
                            __html: post.content.replace(/\n/g, "<br />"),
                        }}
                    />
                    <div className="font-normal text-xs text-blue-1">
                        {post.tags.map((tag) => `#${tag}`).join(" ")}
                    </div>
                </div>
                {/* IMAGE */}
                {post.images.length > 0 && (
                    <Swiper className="bg-white border-b" pagination={true} modules={[Pagination]}>
                        {post.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={image}
                                    alt="image post"
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default PostFeedDetailAdmin
