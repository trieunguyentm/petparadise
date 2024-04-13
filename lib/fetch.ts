"use server"

import { IPostDocument, IUserDocument } from "@/types"
import { cookies } from "next/headers"
const cookieStore = cookies()

const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
}

export const fetchUser = async () => {
    // await delay(3000)
    try {
        const t = cookieStore.get("t")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${t?.name}=${t?.value}`,
            },
            credentials: "include",
            cache: "no-cache",
        })
        const data = await res.json()
        console.log(data)
        if (!res.ok) {
            return null
        } else {
            return data.data as IUserDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch user info")
    }
}

export const fetchPost = async () => {
    try {
        const t = cookieStore.get("t")
        console.log(t)
        console.log(t?.value)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${t?.name}=${t?.value}`,
            },
            credentials: "include",
            cache: "no-cache",
        })
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data as IPostDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch new post")
    }
}
