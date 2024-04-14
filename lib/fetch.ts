"use server"

import { IPostDocument, IUserDocument } from "@/types"
import { cookies } from "next/headers"

const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
}

export const fetchUser = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${cookies().get("t")?.name}=${cookies().get("t")?.value}`,
            },
            credentials: "include",
            cache: "no-store",
        })
        const data = await res.json()
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${cookies().get("t")?.name}=${cookies().get("t")?.value}`,
            },
            credentials: "include",
            cache: "no-store",
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

export const fetchSearchPost = async ({ search }: { search: string }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/search?query=${search}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${cookies().get("t")?.name}=${cookies().get("t")?.value}`,
                },
                credentials: "include",
                cache: "no-store",
            },
        )
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

export const fetchOtherUser = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/other`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${cookies().get("t")?.name}=${cookies().get("t")?.value}`,
            },
            credentials: "include",
            cache: "no-store",
        })
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data as IUserDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch list user")
    }
}
