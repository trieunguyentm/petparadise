import { IPetAdoptionPostDocument } from "@/types"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

type FormValues = {
    descriptionForUser: string
    contactInfoDialogUser: string
}

const DialogAdoptPet = ({
    petAdoptionPost,
    setOpenDialogRequest,
    openSnackbar,
    setOpenSnackbar,
    typeSnackbar,
    setTypeSnackbar,
    contentSnackbar,
    setContentSnackbar,
}: {
    petAdoptionPost: IPetAdoptionPostDocument
    setOpenDialogRequest: (arg: boolean) => void
    openSnackbar: boolean
    setOpenSnackbar: (arg: boolean) => void
    typeSnackbar: "success" | "info" | "warning" | "error"
    setTypeSnackbar: (arg: "success" | "info" | "warning" | "error") => void
    contentSnackbar: string
    setContentSnackbar: (arg: string) => void
}) => {
    const router = useRouter()
    /** React Hook Form */
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()

    /** Loading Request */
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false)

    const handleSendRequest = async () => {
        if (!watch("descriptionForUser")) {
            setTypeSnackbar("info")
            setContentSnackbar(
                "Bạn cần điền một số kinh nghiệm về việc chăm sóc thú cưng của bạn thân hoặc nguyện vọng được chăm sóc thú cưng của bạn",
            )
            setOpenSnackbar(true)
            return
        }
        if (!watch("contactInfoDialogUser")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin liên hệ của bạn")
            setOpenSnackbar(true)
            return
        }

        const description = watch("descriptionForUser")
        const contactInfo = watch("contactInfoDialogUser")

        const formData = new FormData()
        formData.append("petAdoptionPost", petAdoptionPost._id.toString())
        formData.append("descriptionForUser", description)
        formData.append("contactInfo", contactInfo)
        formData.append("type", "adopt-pet")

        setLoadingRequest(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/adoption-request/create-adoption-request`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                },
            )
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
                reset({
                    descriptionForUser: "",
                    contactInfoDialogUser: "",
                })
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setOpenDialogRequest(false)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingRequest(false)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="descriptionForUser" className="flex text-sm">
                        Mô tả một số thông tin về kinh nghiệm nuôi thú cưng của bản thân hoặc nguyện
                        vọng được nuôi thú cưng của bạn
                    </label>
                    <textarea
                        {...register("descriptionForUser")}
                        name="descriptionForUser"
                        id="descriptionForUser"
                        cols={20}
                        rows={2}
                        className="text-sm border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="contactInfoDialogUser" className="flex text-sm">
                        Thông tin liên hệ của bạn
                    </label>
                    <textarea
                        {...register("contactInfoDialogUser")}
                        name="contactInfoDialogUser"
                        id="contactInfoDialogUser"
                        cols={20}
                        rows={1}
                        className="text-sm border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant={"ghost"} onClick={() => setOpenDialogRequest(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSendRequest}>
                        {loadingRequest ? <Loader2 className="w-8 h-8 animate-spin" /> : "Send"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DialogAdoptPet
