"use server"

import {
    IAdoptionRequestDocument,
    IChatDocument,
    ILostPetPostDocument,
    INotificationDocument,
    IPetAdoptionPostDocument,
    IPostDocument,
    IProductDocument,
    IUserDocument,
} from "@/types"
import { cookies } from "next/headers"

const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
}

async function getSessionId() {
    const cookieData = cookies().get("t")
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(cookieData)
        }, 100),
    )
}

export const fetchUser = async () => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/search?query=${search}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/search?query=${search}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/other`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post/detail/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/find-pet-post`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/find-pet-post/${postId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notification`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/pet-adoption-post`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
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
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/pet-adoption-post/${postId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
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

export const fetchAdoptionRequestByPost = async ({ postId }: { postId: string }) => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/adoption-request/${postId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
                },
                credentials: "include",
                cache: "no-store",
            },
        )
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data as {
                adoptionRequests: IAdoptionRequestDocument[]
                totalRequests: number
            }
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch request")
    }
}

export const fetchAdoptedPetOwner = async ({ postId }: { postId: string }) => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/${postId}/adopted-pet-owner`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
                },
                credentials: "include",
                cache: "no-store",
            },
        )
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data.adopter as IUserDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch adopted pet owner")
    }
}

export const fetchProduct = async () => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
            },
            credentials: "include",
            cache: "no-store",
        })
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data.products as IProductDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch product")
    }
}

export const fetchProductById = async ({ productId }: { productId: string }) => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${sessionId?.name}=${sessionId?.value}`,
            },
            credentials: "include",
            cache: "no-store",
        })
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data as IProductDocument
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch product")
    }
}

export const fetchProductByUser = async ({ userId }: { userId: string }) => {
    const sessionId = (await getSessionId()) as { name: string; value: string }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/product?seller=${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${sessionId?.name}=${sessionId?.value}`,
                },
                credentials: "include",
                cache: "no-store",
            },
        )
        const data = await res.json()
        if (!res.ok) {
            return null
        } else {
            return data.data.products as IProductDocument[]
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch product")
    }
}
