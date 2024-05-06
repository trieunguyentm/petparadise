"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"

const LogoutComponent = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleLogout = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const data = await res.json()
            if (!res.ok) {
                if (data.type === "ERROR_SESSION") {
                    // Lưu thông báo vào localStorage
                    localStorage.setItem(
                        "toastMessage",
                        JSON.stringify({ type: "error", content: data.message }),
                    )
                    router.push("/login")
                    return
                }
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            if (data.success) {
                router.push("/")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className="p-1 my-auto flex flex-row gap-2 items-center text-brown-1 hover:bg-red-100 rounded-xl cursor-pointer max-sm:justify-center"
                onClick={handleLogout}
            >
                {!loading ? (
                    <>
                        <Image
                            src={"/assets/images/log-out.svg"}
                            alt="log-out"
                            width={40}
                            height={40}
                        />
                        <div className="font-medium text-base max-sm:hidden">Log out</div>{" "}
                    </>
                ) : (
                    <Loader2 className="w-10 h-10 animate-spin" />
                )}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default LogoutComponent
