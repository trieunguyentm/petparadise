"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useForm } from "react-hook-form"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

type FormValues = {
    photo: File[]
    caption: string
    tag: string
}

const FormCreatePost = () => {
    const [caption, setCaption] = useState("")
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>()

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
        console.log(watch("photo"))
        console.log(watch("caption"))
        console.log(watch("tag"))
        console.log(previewImages)
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll"
        >
            <div className="flex flex-col pb-16 text-brown-1">
                <div className="font-semibold text-3xl">Create post</div>
            </div>
            <label htmlFor="photo" className="flex items-center gap-3 cursor-pointer">
                <Image
                    src={"/assets/images/image-plus.svg"}
                    alt="images-plus"
                    width={100}
                    height={100}
                    priority={true}
                />
                <div className="font-semibold text-xl text-brown-1">Upload a photo</div>
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
                <label htmlFor="caption" className="text-brown-1 font-medium text-xl">
                    Caption
                </label>
                <div className="relative">
                    <textarea
                        {...register("caption", {
                            required: "Caption is required",
                            validate: (value: string) => {
                                if (value.trim().length === 0) {
                                    return "Caption is required"
                                }
                            },
                        })}
                        name="caption"
                        id="caption"
                        rows={5}
                        className="border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="absolute bottom-2 right-1 cursor-pointer">
                                <Image
                                    src={"/assets/images/smile-plus.svg"}
                                    alt="smile-plus"
                                    width={20}
                                    height={20}
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
                    Tag
                </label>
                <div className="relative">
                    <textarea
                        {...register("tag", {
                            required: "Tag is required",
                        })}
                        name="tag"
                        id="tag"
                        rows={1}
                        className="border p-3 w-full rounded-xl focus:outline-none border-brown-1"
                    />
                </div>
            </div>
            <div className="flex justify-center mt-10 w-full">
                <Button type="submit" className="w-full">
                    Publish
                </Button>
            </div>
        </form>
    )
}

export default FormCreatePost
