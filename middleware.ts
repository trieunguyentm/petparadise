import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const authRoute = [
    "/login",
    "/register",
    "/verify-otp",
    "/recovery-password",
    "/verify-otp-recovery",
    "/confirm-password",
]

const verifyRoute = ["/verify-otp", "/verify-otp-recovery", "/confirm-password"]

export async function middleware(request: NextRequest) {
    // Set auth
    let auth: boolean = false
    let cookie = request.cookies.get("t")
    if (!cookie) {
        auth = false
    } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `t=${cookie.value}`,
            },
            credentials: "include",
        })
        const data = await res.json()
        if (data.auth) {
            auth = true
        }
    }
    /** Protect route */
    let url: string = request.nextUrl.pathname
    if (authRoute.includes(url) && auth) {
        // Quay về trang chủ
        return NextResponse.redirect(new URL("/", request.url))
    }
    if (authRoute.includes(url) && !auth) {
        // Xử lý các route /verify-otp, /verify-otp-password, /confirm-password
        if (verifyRoute.includes(url)) {
            const cookieName = url.substring(1)
            const cookieValue = request.cookies.get(cookieName)?.value
            if (!cookieValue) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${cookieName}=${cookieValue}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    cookieName,
                }),
            })
            const data = await res.json()
            if (!data.verify) {
                const response = NextResponse.redirect(new URL("/login", request.url))
                response.cookies.set(cookieName, "", { expires: 0 })
                return response
            } else {
                return NextResponse.next()
            }
        } else {
            // Accept Request
            return NextResponse.next()
        }
    }
    if (!authRoute.includes(url) && !auth) {
        // Quay về login
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.set("t", "", {
            expires: 0,
        })
        return response
    }
    if (!authRoute.includes(url) && auth) {
        return NextResponse.next()
    }
}

// Apply middleware to paths
export const config = {
    matcher: ["/((?!api|_next/static|favicon.ico|assets).*)"],
}
