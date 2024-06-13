"use client"

import { CircleChevronLeft } from "lucide-react"
import React, { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet"
import { IChatDocument, IUserDocument } from "@/types"
import { useDebouncedCallback } from "use-debounce"
import ListMessageCard from "./list-message-card"

const TitleMessagePage = ({
    chats,
    user,
}: {
    chats: IChatDocument[] | null
    user: IUserDocument
}) => {
    const [search, setSearch] = useState<string>("")
    // const [listChat, setListChat] = useState<IChatDocument[] | null>(chats)

    const handleChangeSearch = useDebouncedCallback((text: string) => {
        setSearch(text)
    }, 600)

    return (
        <div className="flex justify-between">
            <div className="text-brown-1 font-medium">
                Chọn danh sách người dùng để bắt đầu một cuộc trò chuyện
            </div>
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger>
                        <div className="cursor-pointer text-brown-1 transition-all hover:-translate-x-2 hover:opacity-55">
                            <CircleChevronLeft />
                        </div>
                    </SheetTrigger>
                    <SheetContent className="overflow-scroll">
                        {/* INPUT */}
                        <div className="bg-gradient-to-tr from-pink-1 to-yellow-50 py-2 pl-2 pr-8 rounded-xl relative border-2 border-brown-1">
                            <input
                                type="text"
                                placeholder="Tìm cuộc trò chuyện..."
                                className="focus:outline-none py-2 px-1 bg-transparent"
                                onChange={(e) => handleChangeSearch(e.target.value)}
                            />
                            {/* <Image
                                src={"/assets/images/search.svg"}
                                alt="search"
                                width={25}
                                height={25}
                                className="absolute top-4 right-2 cursor-pointer"
                            /> */}
                        </div>
                        <div className="flex flex-1 overflow-scroll flex-col gap-4 pt-4 mt-6 border-t border-brown-1">
                            {!chats ? (
                                <div className="flex items-center justify-center text-brown-1">
                                    Bạn chưa tham gia cuộc trò chuyện nào, hãy chọn bạn bè của bạn
                                    và bắt đầu một cuộc trò chuyện
                                </div>
                            ) : (
                                <ListMessageCard chats={chats} user={user} search={search} />
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default TitleMessagePage
