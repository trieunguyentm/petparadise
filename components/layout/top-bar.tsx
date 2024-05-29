"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const TopBar = () => {
    const router = useRouter()
    const [search, setSearch] = useState<string>("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch()
        }
    }

    const handleSearch = () => {
        if (search.trim() !== "") {
            router.push(`/search-post/${search}`)
        }
    }

    return (
        <div className="py-4 flex justify-between mb-1">
            <div className="pl-4 py-2 pr-8 bg-gradient-to-tr from-pink-1 to-yellow-50 rounded-xl relative border-2 border-brown-1 text-sm">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết ..."
                    className="bg-transparent focus:outline-none py-2"
                    onKeyDown={handleKeyDown}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Image
                    src={"/assets/images/search.svg"}
                    alt="search"
                    width={25}
                    height={25}
                    className="absolute top-4 right-2 cursor-pointer transition-all hover:-translate-y-1.5"
                    onClick={handleSearch}
                />
            </div>
            <Link
                href={"/create-post"}
                className="bg-gradient-to-tr from-pink-1 to-yellow-50 rounded-xl flex items-center pl-4 pr-6 border-2 border-brown-1 text-sm max-md:hidden"
            >
                <div className="flex gap-2 text-brown-1 items-center">
                    <Image
                        src={"/assets/images/plus.svg"}
                        alt="plus"
                        width={25}
                        height={25}
                        className="transition-all hover:-translate-y-1.5"
                    />
                    Tạo bài viết mới
                </div>
            </Link>
        </div>
    )
}

export default TopBar
