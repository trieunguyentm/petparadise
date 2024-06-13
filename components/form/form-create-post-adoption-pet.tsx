"use client"

import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { GenderPet, LocationPet, SizePet, TypePet } from "../container/find-pet-container"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import LocationSelector from "../shared/location-selector"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { PetReasonFind } from "../container/pet-adoption-container"

const filterTypePet = [
    { value: "all", text: "Chọn loại thú cưng của bạn" },
    { value: "dog", text: "Chó" },
    { value: "cat", text: "Mèo" },
    { value: "bird", text: "Chim" },
    { value: "rabbit", text: "Thỏ" },
    { value: "fish", text: "Cá" },
    { value: "rodents", text: "Loài gặm nhấm" },
    { value: "reptile", text: "Loài bò sát" },
    { value: "other", text: "Khác" },
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

const filterReasonPet = [
    { value: "all", text: "Hãy cung cấp lí do cần tìm chủ cho thú cưng" },
    { value: "lost-pet", text: "Thú cưng này bị lạc hoặc bỏ rơi, tôi muốn tìm chủ của nó" },
    { value: "your-pet", text: "Tôi muốn tìm chủ nhân mới cho thú cưng của tôi" },
]

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

type FormValues = {
    healthInfo: string
    description: string
    contactInfo: string
    photo: File[]
}

const FormCreatePostAdoptionPet = () => {
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
    const [reason, setReason] = useState<PetReasonFind>("all")
    const reasonRef = useRef<HTMLDivElement>(null)
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const locationPetRef = useRef<HTMLDivElement>(null)

    const healthInfoRef = useRef<HTMLDivElement>(null)
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
        if (reason === "all") {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần chọn lý do tìm chủ mới cho thú cưng")
            setOpenSnackbar(true)
            reasonRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (
            locationPet.cityName === "" ||
            locationPet.districtName === "" ||
            locationPet.wardName === ""
        ) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin về vị trí hiện tại của thú cưng")
            setOpenSnackbar(true)
            locationPetRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (!watch("healthInfo")) {
            setTypeSnackbar("info")
            setContentSnackbar(
                "Bạn cần điền thông tin mô tả tính trạng sức khỏe hiện tại của thú cưng",
            )
            setOpenSnackbar(true)
            healthInfoRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }
        if (!watch("description")) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền thông tin mô tả về thú cưng và các yêu cầu của bạn")
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
            setContentSnackbar("Hãy cung cấp thêm hình ảnh về thú cưng")
            setOpenSnackbar(true)
            return
        }
        // Tạo FormData
        const formData = new FormData()
        const files = watch("photo")
        formData.append("typePet", typePet)
        if (genderPet !== "all") {
            formData.append("genderPet", genderPet)
        }
        if (sizePet !== "all") {
            formData.append("sizePet", sizePet)
        }
        formData.append("reason", reason)
        formData.append(
            "location",
            `${locationPet.cityName}-${locationPet.districtName}-${locationPet.wardName}`,
        )
        formData.append("healthInfo", watch("healthInfo"))
        formData.append("description", watch("description"))
        formData.append("contactInfo", watch("contactInfo"))
        files.forEach((file) => formData.append("photos", file))

        // SEND API
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/pet-adoption/create-pet-adoption-post`,
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
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
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
                <div className="font-semibold text-3xl">Tạo bài đăng tìm chủ nhân cho thú cưng</div>
            </div>
            <div>
                Hãy điền các thông tin vào biểu mẫu dưới đây để tìm kiếm chủ nhân cho thú cưng. Cung
                cấp các thông tin về chi tiết về thú cưng của bạn, các yêu cầu đối với chủ nhân mới
                của thú cưng. Ngoài ra hãy cung cấp nguồn gốc của thú cưng một cách cụ thể.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-4">
                {/* TYPE PET */}
                <div ref={typePetRef} className="flex flex-col gap-1">
                    <label htmlFor="typePet" className="text-sm text-brown-1 font-semibold">
                        Thú cưng của bạn thuộc loại nào ? <span className="text-red-500">*</span>
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
                        Độ lớn của thú cưng như nào ?
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
                {/* REASON FIND OWNER FOR PET */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="reasonPet" className="text-sm text-brown-1 font-semibold">
                        Lý do cần tìm chủ mới cho thú cưng là gì ?{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <Select
                        onValueChange={(value: PetReasonFind) => setReason(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Cung cấp lí do cần tìm chủ mới cho thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filterReasonPet.map((filter) => (
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
                    Vị trí hiện tại thú cưng của bạn ? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-1">
                    <LocationSelector setLocationPet={setLocationPet} />
                </div>
            </div>
            {/* TÌNH TRẠNG SỨC KHỎE */}
            <div className="mt-4 flex flex-col" ref={healthInfoRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Hãy mô tả thêm tình trạng sức khỏe của thú cưng{" "}
                    <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("healthInfo")}
                    rows={2}
                    className="p-1 rounded-lg border focus:outline-none resize-none"
                />
            </div>
            {/* MÔ TẢ CHI TIẾT */}
            <div className="mt-4 flex flex-col" ref={descriptionRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Hãy cung cấp thêm thêm thông tin chi tiết về thú cưng (thói quen, cách ăn uống,
                    cách nuôi thú cưng, các yêu cầu của bạn đối với chủ nhân mới của thú cưng...{" "}
                    <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("description")}
                    rows={4}
                    className="p-1 rounded-lg border focus:outline-none resize-none"
                />
            </div>
            {/* THÔNG TIN LIÊN HỆ */}
            <div className="mt-4 flex flex-col" ref={contactInfoRef}>
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Hãy cung cấp thông tin để ai đó có thể liên hệ trực tiếp với bạn và trao đổi
                    thêm <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("contactInfo")}
                    rows={3}
                    className="p-1 rounded-lg border focus:outline-none resize-none"
                />
            </div>
            {/* PHOTO */}
            <div className="mt-4 flex flex-col">
                <label htmlFor="timePet" className="text-sm text-brown-1 font-semibold">
                    Hãy cung cấp thêm hình ảnh thú cưng <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 items-center hover:opacity-50">
                    <label htmlFor="photo" className="cursor-pointer">
                        <ImagePlus className="text-brown-1 w-10 h-10" />
                    </label>
                    <div className="text-brown-1 text-sm font-semibold">Tải ảnh lên</div>
                </div>

                <input
                    {...register("photo")}
                    type="file"
                    id="photo"
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

export default FormCreatePostAdoptionPet
