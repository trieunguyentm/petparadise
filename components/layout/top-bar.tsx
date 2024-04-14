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
            <div className="pl-4 py-2 pr-8 bg-pink-1 rounded-xl relative border border-brown-1">
                <input
                    type="text"
                    placeholder="Search post"
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
                    className="absolute top-4 right-2 cursor-pointer"
                    onClick={handleSearch}
                />
            </div>
            <Link
                href={"/create-post"}
                className="bg-gradient-to-tr from-pink-1 to-yellow-50 rounded-xl flex items-center pl-4 pr-6 border border-brown-1"
            >
                <div className="flex gap-2 text-brown-1">
                    <Image src={"/assets/images/plus.svg"} alt="plus" width={25} height={25} />
                    Create Post
                </div>
            </Link>
        </div>
    )
}

export default TopBar
