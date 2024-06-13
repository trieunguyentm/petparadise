"use client"

import { IUserDocument, TypePet } from "@/types"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { Dog, Loader2, MapPin, PenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import LocationSelector from "./location-selector"
import { LocationPet } from "../container/find-pet-container"

type FormValues = {
    photo: File | null
}

const filterTypePet = [
    { value: "dog", text: "Chó" },
    { value: "cat", text: "Mèo" },
    { value: "bird", text: "Chim" },
    { value: "rabbit", text: "Thỏ" },
    { value: "fish", text: "Cá" },
    { value: "rodents", text: "Loài gặm nhấm" },
    { value: "reptile", text: "Loài bò sát" },
    { value: "other", text: "Khác" },
]

const typePet = {
    dog: "Chó",
    cat: "Mèo",
    bird: "Chim",
    rabbit: "Thỏ",
    fish: "Cá",
    rodents: "Loài gặm nhấm",
    reptile: "Loài bò sát",
    other: "Khác",
}

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

const UserInfo = ({ user }: { user: IUserDocument | null }) => {
    const router = useRouter()
    /** React hook form */
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<FormValues>({
        mode: "onChange",
    })
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    // Khai báo state để lưu trữ URL của bản xem trước ảnh
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    // Selected pet types
    const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>(user?.petTypeFavorites || [])
    // Checkbox
    const [showPetType, setShowPetType] = useState<boolean>(false)
    const [showLocation, setShowLocation] = useState<boolean>(false)

    const [isChange, setIsChange] = useState<boolean>(false)

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0] // Lấy file đầu tiên, vì đang thay đổi ảnh đại diện

            // Sử dụng 'setValue' để cập nhật trường 'photo' trong form
            setValue("photo", file, { shouldValidate: true })

            // Tạo URL tạm thời cho bản xem trước và cập nhật state
            const imageUrl = URL.createObjectURL(file)
            setPreviewImageUrl(imageUrl)
        }
    }

    const handleCancel = () => {
        // Set 'photo' field to null
        setValue("photo", null)
        // Clear the preview image URL
        setPreviewImageUrl(null)
        // Make sure to revoke the object URL to release memory
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
        // Reset changes
        setSelectedPetTypes(user?.petTypeFavorites || [])
        setLocationPet(initialLocationState)
    }

    const handleSubmitForm = async () => {
        const file = watch("photo")

        const formData = new FormData()
        if (file) {
            formData.append("photo", file)
        }
        const { cityName, districtName, wardName } = locationPet
        if (cityName && districtName && wardName) {
            formData.append("location", `${cityName}-${districtName}-${wardName}`)
        }
        selectedPetTypes.forEach((petType: string) => {
            formData.append("typePet", petType)
        })
        try {
            setLoadingUpdate(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`, {
                method: "PUT",
                credentials: "include",
                body: formData,
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
            setLoadingUpdate(false)
            // Set 'photo' field to null
            setValue("photo", null)
            // Clear the preview image URL
            setPreviewImageUrl(null)

            // Make sure to revoke the object URL to release memory
            if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
        }
    }

    const handleCheckboxChange = (petType: string) => {
        setSelectedPetTypes((prevSelectedPetTypes) => {
            if (prevSelectedPetTypes.includes(petType)) {
                return prevSelectedPetTypes.filter((type) => type !== petType)
            } else {
                return [...prevSelectedPetTypes, petType]
            }
        })
    }

    useEffect(() => {
        const hasChangedAvatar = previewImageUrl !== null
        const hasChangedPetTypes =
            JSON.stringify(selectedPetTypes) !== JSON.stringify(user?.petTypeFavorites || [])
        const hasChangedLocation =
            locationPet.cityName !== "" ||
            locationPet.districtName !== "" ||
            locationPet.wardName !== ""

        setIsChange(hasChangedAvatar || hasChangedPetTypes || hasChangedLocation)
    }, [previewImageUrl, selectedPetTypes, locationPet, user?.petTypeFavorites])

    return (
        <div className="flex flex-col">
            <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                Thông tin cá nhân
            </div>
            <div className="flex justify-between items-center p-5">
                <label htmlFor="photo" className="cursor-pointer hover:opacity-65">
                    {previewImageUrl ? (
                        <Image
                            src={previewImageUrl}
                            className="rounded-full"
                            alt="Preview"
                            width={140}
                            height={140}
                            priority
                            style={{ clipPath: "circle()" }}
                        />
                    ) : (
                        <Image
                            src={user?.profileImage || "/assets/images/avatar.jpeg"}
                            className="rounded-full"
                            alt="@shadcn"
                            width={140}
                            height={140}
                            priority
                            style={{ clipPath: "circle()" }}
                        />
                    )}
                </label>
                <input
                    {...register("photo")}
                    type="file"
                    id="photo"
                    className="hidden"
                    accept="image/*"
                    onChange={onFileChange}
                />

                <div className="flex flex-col gap-3 text-brown-1 max-md:text-xs">
                    <div className="flex gap-2">
                        <Image
                            src={"/assets/images/circle-user-round.svg"}
                            alt="user-round"
                            width={25}
                            height={25}
                        />
                        <div>{user?.username}</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image src={"/assets/images/rss.svg"} alt="cake" width={25} height={25} />
                        <div>Người theo dõi: {user?.followers.length} người</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image
                            src={"/assets/images/rss.svg"}
                            alt="map-pin"
                            width={25}
                            height={25}
                        />
                        <div>Đang theo dõi: {user?.following.length} người</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="text-brown-1 flex gap-2 items-center">
                    <Dog />
                    Loại thú cưng quan tâm:{" "}
                    {user?.petTypeFavorites && user.petTypeFavorites.length > 0
                        ? user.petTypeFavorites.map((type) => typePet[type]).join(", ")
                        : "Chưa cung cấp thông tin"}
                    <PenLine
                        className="w-5 h-5 cursor-pointer hover:opacity-50"
                        onClick={() => setShowPetType((prev) => !prev)}
                    />
                </div>
                {showPetType && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {filterTypePet.map((filter, index) => {
                                return (
                                    <div key={index} className="flex gap-1 items-center">
                                        <Checkbox
                                            id={filter.value}
                                            checked={selectedPetTypes.includes(filter.value)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(filter.value)
                                            }
                                        />
                                        <label htmlFor={filter.value} className="text-brown-1">
                                            {filter.text}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                <div className="text-brown-1 flex gap-2 items-center">
                    <MapPin />
                    Địa chỉ hiện tại của bạn: {user?.address || "Chưa cung cấp thông tin"}
                    <PenLine
                        className="w-5 h-5 cursor-pointer hover:opacity-50"
                        onClick={() => setShowLocation((prev) => !prev)}
                    />
                </div>
                {showLocation && (
                    <div className="flex flex-col gap-2">
                        <LocationSelector setLocationPet={setLocationPet} />
                    </div>
                )}
            </div>
            {isChange && (
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="submit" disabled={loadingUpdate} onClick={handleSubmitForm}>
                        {loadingUpdate ? <Loader2 className="w-8 h-8 animate-spin" /> : "Lưu"}
                    </Button>
                    <Button variant={"ghost"} onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            )}
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default UserInfo
