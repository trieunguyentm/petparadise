"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const TopBarPeople = () => {
    const router = useRouter()
    const [search, setSearch] = useState<string>("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch()
        }
    }

    const handleSearch = () => {
        if (search.trim() !== "") {
            router.push(`/search-people/${search}`)
        } else {
            router.push(`/people`)
        }
    }

    return (
        <div className="flex pb-16 text-brown-1 justify-between">
            <div className="font-semibold text-3xl">People</div>
            <div className="relative pl-4 py-2 pr-8 bg-pink-1 rounded-xl border border-brown-1">
                <input
                    type="text"
                    placeholder="Search people"
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
        </div>
    )
}

export default TopBarPeople
