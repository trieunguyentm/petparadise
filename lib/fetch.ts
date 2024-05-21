"use server"

import {
    IChatDocument,
    ILostPetPostDocument,
    INotificationDocument,
    IPetAdoptionPostDocument,
    IPostDocument,
    IUserDocument,
} from "@/types"
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

export const fetchSearchPeople = async ({ search }: { search: string }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/search?query=${search}`,
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
            return data.data as IUserDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch search")
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

export const fetchDetailPost = async ({ postId }: { postId: string }) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post/detail/${postId}`, {
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
            return data.data as IPostDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch detail post")
    }
}

export const fetchChatByUser = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
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
            return data.data as IChatDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch list conversation")
    }
}

export const fetchDetailChat = async ({ chatId }: { chatId: string }) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${chatId}`, {
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
            return data.data as IChatDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch chat")
    }
}

export const fetchFindPetPost = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/find-pet-post`, {
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
            return data.data as ILostPetPostDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch new find pet post")
    }
}

export const fetchFindPetPostById = async ({ postId }: { postId: string }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/find-pet-post/${postId}`,
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
            return data.data as ILostPetPostDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch detail post")
    }
}

export const fetchNotification = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notification`, {
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
            return data.data as {
                notifications: INotificationDocument[]
                total: number
                limit: number
                offset: number
            }
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch notification")
    }
}

export const fetchPetAdoptionPost = async () => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/pet-adoption-post`,
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
            return data.data as IPetAdoptionPostDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch pet adoption post")
    }
}

export const fetchPetAdoptionPostById = async ({ postId }: { postId: string }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/pet-adoption-post/${postId}`,
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
            return data.data as IPetAdoptionPostDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch detail post")
    }
}
