"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

const FormCreatePost = () => {
    const [caption, setCaption] = useState("")

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setCaption(caption + emojiString)
    }

    return (
        <form className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
            <div className="flex flex-col pb-16 text-brown-1">
                <div className="font-semibold text-3xl">Create post</div>
            </div>
            <div className="flex items-center gap-3">
                <Image
                    src={"/assets/images/image-plus.svg"}
                    alt="images-plus"
                    width={100}
                    height={100}
                />
                <div className="font-semibold text-xl text-brown-1">Upload a photo</div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="caption" className="text-brown-1 font-medium text-xl">
                    Caption
                </label>
                <div className="relative">
                    <textarea
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
                        name="tag"
                        id="tag"
                        rows={1}
                        className="border p-3 w-full rounded-xl focus:outline-none border-brown-1"
                    />
                </div>
            </div>
            <div className="flex justify-center mt-10 w-full">
                <Button className="w-full">Publish</Button>
            </div>
        </form>
    )
}

export default FormCreatePost
