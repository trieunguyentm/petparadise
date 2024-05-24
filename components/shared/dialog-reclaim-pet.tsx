"use client"

import { Dot, ImagePlus, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { IPetAdoptionPostDocument } from "@/types"
import { useRouter } from "next/navigation"

type FormValues = {
    photosPet: File[]
    descriptionForPet: string
    contactInfoDialog: string
}

const DialogReclaimPet = ({
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
    /** Router */
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
    /** Preview image */
    const [previewImages, setPreviewImages] = useState<string[]>([])
    /** Loading Request */
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false)

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("photosPet", filesArray, { shouldValidate: true })
            // Tạo bản xem trước cho mỗi file ảnh
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }

    const handleDeleteImage = (index: number) => {
        // Cập nhật danh sách các file ảnh đã chọn
        const updatedFiles = watch("photosPet").filter((_: File, i: number) => i !== index)
        setValue("photosPet", updatedFiles, { shouldValidate: true })

        // Cập nhật danh sách các URL xem trước ảnh
        const updatedPreviews = previewImages.filter((_: string, i: number) => i !== index)
        setPreviewImages(updatedPreviews)
    }

    const handleSendRequest = async () => {
        if (!watch("descriptionForPet")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền một số mô tả về thú cưng")
            setOpenSnackbar(true)
            return
        }
        if (!watch("contactInfoDialog")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin liên hệ của bạn")
            setOpenSnackbar(true)
            return
        }
        if (!watch("photosPet").length) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần cung cấp một số hình ảnh về thú cưng")
            setOpenSnackbar(true)
            return
        }

        const descriptionForPet = watch("descriptionForPet")
        const contactInfo = watch("contactInfoDialog")
        const files = watch("photosPet")

        const formData = new FormData()
        formData.append("petAdoptionPost", petAdoptionPost._id.toString())
        formData.append("type", "reclaim-pet")
        formData.append("contactInfo", contactInfo)
        formData.append("descriptionForPet", descriptionForPet)
        files.forEach((file) => formData.append("photos", file))

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
                    descriptionForPet: "",
                    contactInfoDialog: "",
                    photosPet: [],
                })
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setValue("photosPet", [])
                setPreviewImages([])
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
                    <label htmlFor="descriptionForPet" className="flex text-sm">
                        Nếu bạn là chủ nhân cũ của thú cưng và muốn nhận lại, hãy mô tả một số đặc
                        điểm của thú cưng
                    </label>
                    <textarea
                        {...register("descriptionForPet")}
                        name="descriptionForPet"
                        id="descriptionForPet"
                        cols={20}
                        rows={2}
                        className="text-sm border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="contactInfoDialog" className="flex text-sm">
                        Thông tin liên hệ của bạn
                    </label>
                    <textarea
                        {...register("contactInfoDialog")}
                        name="contactInfoDialog"
                        id="contactInfoDialog"
                        cols={20}
                        rows={1}
                        className="text-sm border px-3 pt-3 pb-8 w-full rounded-xl focus:outline-none border-brown-1 resize-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="photosPet" className="flex items-center gap-3 cursor-pointer">
                        <ImagePlus />
                        <div className="text-sm">Tải ảnh lên</div>
                    </label>
                    <input
                        {...register("photosPet")}
                        type="file"
                        id="photosPet"
                        className="hidden"
                        accept="image/*"
                        onChange={onFileChange} // Thêm sự kiện onChange để cập nhật giá trị file
                        multiple
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {previewImages.map((imageURL, index) => (
                        <div key={index} className="relative">
                            <Image
                                src={imageURL}
                                alt="image-attach"
                                width={1000}
                                height={300}
                                priority
                            />
                            <Button
                                variant={"ghost"}
                                onClick={() => handleDeleteImage(index)}
                                className="p-0 w-4 h-4 text-sm absolute top-0 -right-2 text-red-600 bg-slate-400 rounded-full"
                            >
                                <X />
                            </Button>
                        </div>
                    ))}
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

export default DialogReclaimPet
