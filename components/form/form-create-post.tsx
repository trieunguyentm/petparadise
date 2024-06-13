"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useForm } from "react-hook-form"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { CircleAlert, Loader2 } from "lucide-react"
import SnackbarCustom from "../ui/snackbar"
import { Tooltip, Zoom } from "@mui/material"
import { useRouter } from "next/navigation"

type FormValues = {
    photo: File[]
    content: string
    tag: string
}

const FormCreatePost = () => {
    const router = useRouter()
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
    const [caption, setCaption] = useState("")
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setCaption(caption + emojiString)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("photo", filesArray, { shouldValidate: true })
            // Tạo bản xem trước cho mỗi file ảnh
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }

    const handleSubmitForm = async () => {
        // Khởi tạo FormData
        const formData = new FormData()
        const files = watch("photo") // Lấy file từ React Hook Form's watch
        if (files.length > 0) {
            files.forEach((file) => {
                formData.append("photos", file)
            })
        }

        // Append các giá trị form khác
        formData.append("content", caption)
        formData.append("tags", watch("tag"))
        try {
            setLoadingCreate(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post/create`, {
                method: "POST",
                credentials: "include",
                body: formData,
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
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                reset({
                    photo: [],
                    content: "",
                    tag: "",
                })
                setCaption("") // Reset caption state
                setPreviewImages([]) // Clear preview images
                // Reload trang sau một khoảng thời gian ngắn để người dùng có thể nhìn thấy thông báo
                // setTimeout(() => {
                //     window.location.reload()
                // }, 1500) // Đợi 1.5 giây trước khi reload
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingCreate(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll"
        >
            <div className="flex flex-col pb-16 text-brown-1">
                <div className="font-semibold text-3xl">Tạo bài viết</div>
            </div>
            <label htmlFor="photo" className="flex items-center gap-3 cursor-pointer">
                <Image
                    src={"/assets/images/image-plus.svg"}
                    alt="images-plus"
                    width={100}
                    height={100}
                    priority={true}
                />
                <div className="font-semibold text-xl text-brown-1">Tải ảnh lên</div>
            </label>
            <input
                {...register("photo")}
                type="file"
                id="photo"
                className="hidden"
                accept="image/*"
                onChange={onFileChange} // Thêm sự kiện onChange để cập nhật giá trị file
                multiple // Nếu bạn muốn cho phép upload nhiều file
            />
            {
                <div className="flex gap-2 flex-wrap">
                    {previewImages.map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            alt={`Preview ${index}`}
                            width={200}
                            height={200}
                        />
                    ))}
                </div>
            }
            <div className="flex flex-col gap-2 mt-4">
                <label
                    htmlFor="content"
                    className="text-brown-1 font-medium text-xl flex items-center gap-1"
                >
                    Nội dung bài viết{" "}
                    {errors.content && (
                        <Tooltip
                            TransitionComponent={Zoom}
                            title={
                                <div className="text-red-500 p-0">{errors.content?.message}</div>
                            }
                            placement="top"
                        >
                            <CircleAlert
                                className={`text-red-500 w-5 h-5 ${!errors.content && "invisible"}`}
                            />
                        </Tooltip>
                    )}
                </label>
                <div className="relative">
                    <textarea
                        {...register("content", {
                            required: "Cần điền mô tả cho bài viết",
                            validate: (value: string) => {
                                if (value.trim().length === 0) {
                                    return "Cần điền mô tả cho bài viết"
                                }
                            },
                        })}
                        name="content"
                        id="content"
                        rows={5}
                        className="border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="absolute bottom-3 right-2 cursor-pointer">
                                <Image
                                    src={"/assets/images/smile-plus.svg"}
                                    alt="smile-plus"
                                    width={25}
                                    height={25}
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Picker data={data} onEmojiSelect={addEmoji} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="tag" className="text-brown-1 font-medium text-xl">
                    Thẻ gắn kèm
                </label>
                <div className="relative">
                    <textarea
                        {...register("tag")}
                        name="tag"
                        id="tag"
                        rows={1}
                        className="border p-3 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                    />
                </div>
            </div>
            <div className="flex justify-center mt-10 w-full">
                <Button type="submit" className="w-full">
                    {loadingCreate ? <Loader2 className="w-8 h-8 animate-spin" /> : "Tạo bài viết"}
                </Button>
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </form>
    )
}

export default FormCreatePost
