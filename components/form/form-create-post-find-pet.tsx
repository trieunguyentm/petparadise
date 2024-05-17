"use client"

import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { GenderPet, LocationPet, SizePet, TypePet } from "../container/find-pet-container"
import LocationSelector from "../shared/location-selector"
import DatePickerDemo from "../shared/date-picker"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"

const filterTypePet = [
    { value: "all", text: "Chọn loại thú cưng của bạn" },
    { value: "dog", text: "Dog" },
    { value: "cat", text: "Cat" },
    { value: "bird", text: "Bird" },
    { value: "rabbit", text: "Rabbit" },
    { value: "fish", text: "Fish" },
    { value: "rodents", text: "Rodents" },
    { value: "reptile", text: "Reptile" },
    { value: "other", text: "Other" },
]

const filterGenderPet = [
    { value: "all", text: "Cung cấp giới tính của thú cưng" },
    { value: "male", text: "Giống đực" },
    { value: "female", text: "Giống cái" },
]

const filterSizePet = [
    { value: "all", text: "Cung cấp cân nặng của thú cưng" },
    { value: "small", text: "0kg - 5kg" },
    { value: "medium", text: "5kg - 15kg" },
    { value: "big", text: "> 15kg" },
]

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

type FormValues = {
    description: string
    contactInfo: string
    photo: File[]
}

const FormCreatePostFindPet = () => {
    const router = useRouter()
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()

    const [loading, setLoading] = useState<boolean>(false)

    // FILTER PET
    const [typePet, setTypePet] = useState<TypePet>("all")
    const typePetRef = useRef<HTMLDivElement>(null)
    const [genderPet, setGenderPet] = useState<GenderPet>("all")
    const [sizePet, setSizePet] = useState<SizePet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const locationPetRef = useRef<HTMLDivElement>(null)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const selectedDateRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const contactInfoRef = useRef<HTMLDivElement>(null)
    const [previewImages, setPreviewImages] = useState<string[]>([])

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("photo", filesArray, { shouldValidate: true })
            // Tạo bản xem trước cho mỗi file ảnh
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }

    const handleDeleteImage = (index: number) => {
        // Cập nhật danh sách các file ảnh đã chọn
        const updatedFiles = watch("photo").filter((_: File, i: number) => i !== index)
        setValue("photo", updatedFiles, { shouldValidate: true })

        // Cập nhật danh sách các URL xem trước ảnh
        const updatedPreviews = previewImages.filter((_: string, i: number) => i !== index)
        setPreviewImages(updatedPreviews)
    }

    const handlePost = async () => {
        if (typePet === "all") {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần chọn loại thú cưng")
            setOpenSnackbar(true)
            typePetRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (
            locationPet.cityName === "" ||
            locationPet.districtName === "" ||
            locationPet.wardName === ""
        ) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin về vị trí lần cuối cùng thấy thú cưng")
            setOpenSnackbar(true)
            locationPetRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (!selectedDate) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin về thời gian mà thú cưng bị mất")
            setOpenSnackbar(true)
            locationPetRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (!watch("description")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin mô tả thêm về thú cưng")
            setOpenSnackbar(true)
            descriptionRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (!watch("contactInfo")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin liên hệ của bạn")
            setOpenSnackbar(true)
            contactInfoRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (watch("photo").length === 0) {
            setTypeSnackbar("info")
            setContentSnackbar("Hãy cung cấp thêm hình ảnh về thú cưng của bạn")
            setOpenSnackbar(true)
            return
        }
        // Khởi tạo FormData
        const formData = new FormData()
        const files = watch("photo")
        formData.append("typePet", typePet)
        if (genderPet !== "all") {
            formData.append("genderPet", genderPet)
        }
        if (sizePet !== "all") {
            formData.append("sizePet", sizePet)
        }
        formData.append(
            "lastSeenLocation",
            `${locationPet.cityName}-${locationPet.districtName}-${locationPet.wardName}`,
        )
        formData.append("lastSeenDate", selectedDate.toISOString().split("T")[0])
        formData.append("description", watch("description"))
        formData.append("contactInfo", watch("contactInfo"))
        files.forEach((file) => {
            formData.append("photos", file)
        })

        // Send API
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/create-find-pet-post`,
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
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                // Reload trang sau một khoảng thời gian ngắn để người dùng có thể nhìn thấy thông báo
                setTimeout(() => {
                    window.location.reload()
                }, 1500) // Đợi 1.5 giây trước khi reload
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
        <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
            <div className="flex flex-col pb-10 text-brown-1">
                <div onClick={() => router.push("/find-pet")} className="mb-1 cursor-pointer">
                    <ArrowLeft />
                </div>
                <div className="font-semibold text-3xl">Tạo bài đăng tìm thú cưng</div>
            </div>
            <div>
                Vui lòng điền vào mẫu dưới đây để tìm kiếm về thú cưng bị mất của bạn. Cung cấp càng
                nhiều chi tiết càng tốt để tăng cơ hội một ai đó nhận diện ra thú cưng của bạn. Bao
                gồm các mô tả về loại thú cưng, vị trí được biết đến lần cuối, mọi dấu hiệu nhận
                dạng khác và cách liên hệ với bạn nếu ai đó tìm thấy thú cưng của bạn.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-4">
                {/* TYPE PET */}
                <div ref={typePetRef} className="flex flex-col gap-1">
                    <label htmlFor="typePet" className="text-sm text-brown-1 font-semibold">
                        Loại thú cưng của bạn là gì ? <span className="text-red-500">*</span>
                    </label>
                    <Select
                        onValueChange={(value: TypePet) => setTypePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại thú cưng của bạn" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filterTypePet.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.text}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* GENDER PET */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="genderPet" className="text-sm text-brown-1 font-semibold">
                        Giới tính thú cưng của bạn là gì ?
                    </label>
                    <Select
                        onValueChange={(value: GenderPet) => setGenderPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn giới tính của thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filterGenderPet.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.text}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* SIZE PET */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="sizePet" className="text-sm text-brown-1 font-semibold">
                        Thú cưng của bạn có cân nặng khoảng bao nhiêu ?
                    </label>
                    <Select
                        onValueChange={(value: SizePet) => setSizePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Cung cấp cân nặng của thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filterSizePet.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.text}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* LOCATION */}
            <div className="mt-4" ref={locationPetRef}>
                <label htmlFor="locationPet" className="text-sm text-brown-1 font-semibold">
                    Vị trí lần cuối bạn thấy thú cưng của bạn là ở đâu ?{" "}
                    <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-1">
                    <LocationSelector setLocationPet={setLocationPet} />
                </div>
            </div>
            {/* DATE */}
            <div className="mt-4" ref={selectedDateRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Thú cưng của bạn biến mất vào ngày nào ? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-1">
                    <DatePickerDemo date={selectedDate} setDate={setSelectedDate} label="" />
                </div>
            </div>
            {/* DESCRIPTION */}
            <div className="mt-4 flex flex-col" ref={descriptionRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Mô tả thêm chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("description")}
                    rows={6}
                    className="p-1 rounded-lg border focus:outline-none resize-none"
                />
            </div>
            {/* THÔNG TIN LIÊN HỆ */}
            <div className="mt-4 flex flex-col" ref={contactInfoRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Thông tin liên hệ <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("contactInfo")}
                    rows={2}
                    className="p-1 rounded-lg border focus:outline-none resize-none"
                />
            </div>
            {/* PHOTO */}
            <div className="mt-4 flex flex-col">
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Hãy cung cấp thêm hình ảnh thú cưng của bạn{" "}
                    <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 items-center hover:opacity-50">
                    <label htmlFor="photos" className="cursor-pointer">
                        <ImagePlus className="text-brown-1 w-10 h-10" />
                    </label>
                    <div className="text-brown-1 text-sm font-semibold">Tải ảnh lên</div>
                </div>

                <input
                    {...register("photo")}
                    type="file"
                    id="photos"
                    className="hidden"
                    accept="image/*"
                    onChange={onFileChange}
                    multiple
                />
            </div>
            {previewImages && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previewImages.map((imageURL: string, index: number) => (
                        <div key={index} className="relative">
                            <Image
                                src={imageURL}
                                alt="preview image"
                                width={500}
                                height={500}
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
            )}
            <div className="flex justify-center mt-4">
                <Button onClick={handlePost}>
                    {loading ? <Loader2 className="w-8 h-8 animate-spin " /> : "Tạo bài đăng"}
                </Button>
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default FormCreatePostFindPet
