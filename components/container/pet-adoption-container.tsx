import React, { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { GenderPet, LocationPet, SizePet, TypePet } from "./find-pet-container"
import LocationSelector from "../shared/location-selector"
import { Button } from "../ui/button"
import { MessageCirclePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { IPetAdoptionPostDocument } from "@/types"
import PetAdoptionCard from "../shared/pet-adoption-card"

export type PetAdoptionStatus = "all" | "available" | "adopted"

export type PetReasonFind = "all" | "lost-pet" | "your-pet"

const filterTypePet = [
    { value: "all", text: "Tất cả" },
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
    { value: "all", text: "Tất cả" },
    { value: "male", text: "Giống đực" },
    { value: "female", text: "Giống cái" },
]

const filterSizePet = [
    { value: "all", text: "Tất cả" },
    { value: "small", text: "0kg - 5kg" },
    { value: "medium", text: "5kg - 15kg" },
    { value: "big", text: "> 15kg" },
]

const filterStatus = [
    { value: "all", text: "Tất cả" },
    { value: "available", text: "Chưa có người nhận nuôi" },
    { value: "adopted", text: "Đã được nhận nuôi" },
]

const filterReason = [
    { value: "all", text: "Tất cả" },
    { value: "lost-pet", text: "Tìm chủ cho thú cưng đi lạc/bị mất" },
    { value: "your-pet", text: "Tìm chủ mới cho thú cưng" },
]

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

const PetAdoptionContainer = ({
    petAdoptionPosts,
}: {
    petAdoptionPosts: IPetAdoptionPostDocument[] | null
}) => {
    const router = useRouter()
    const [listPost, setListPost] = useState<IPetAdoptionPostDocument[] | null>(petAdoptionPosts)
    // FILTER PET
    const [typePet, setTypePet] = useState<TypePet>("all")
    const [genderPet, setGenderPet] = useState<GenderPet>("all")
    const [sizePet, setSizePet] = useState<SizePet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const [statusPet, setStatusPet] = useState<PetAdoptionStatus>("all")
    const [reasonFindPet, setReasonFindPet] = useState<PetReasonFind>("all")

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                {/* TYPE PET */}
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Loại thú cưng</div>
                    <Select
                        onValueChange={(value: TypePet) => setTypePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn loại thú cưng</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Giới tính thú cưng</div>
                    <Select
                        onValueChange={(value: GenderPet) => setGenderPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn giới tính của thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn giới tính của thú cưng</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Kích thước thú cưng</div>
                    <Select
                        onValueChange={(value: SizePet) => setSizePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn kích thước thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn kích thước thú cưng</SelectLabel>
                                {filterSizePet.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.text}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* LOCATION */}
                <LocationSelector setLocationPet={setLocationPet} />
                {/* STATUS PET */}
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Trạng thái</div>
                    <Select
                        onValueChange={(value: PetAdoptionStatus) => setStatusPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn trạng thái của thú cưng cần tìm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn trạng thái của thú cưng cần tìm</SelectLabel>
                                {filterStatus.map((filter) => (
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
                    <div className="text-sm text-brown-1 font-semibold">Lý do cần tìm chủ mới</div>
                    <Select
                        onValueChange={(value: PetReasonFind) => setReasonFindPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn lý do" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn lý do</SelectLabel>
                                {filterReason.map((filter) => (
                                    <SelectItem key={filter.value} value={filter.value}>
                                        {filter.text}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-full mt-5">
                <Button /**onClick={handleSearchPost}*/ className="w-full bg-brown-1">
                    Tìm kiếm
                </Button>
            </div>
            <div className="w-full mt-5">
                <Button
                    onClick={() => router.push("/pet-adoption/create-post")}
                    className="w-full bg-green-300 text-black hover:text-white"
                >
                    Tạo một bài viết mới để tìm chủ nhân cho thú cưng &nbsp;
                    <MessageCirclePlus className="w-4 h-4" />
                </Button>
            </div>
            {/* DATA POST FIND OWNER */}
            {!listPost || listPost.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center mt-10">
                    There are currently no pet adoption posts
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-16 pb-10 gap-4">
                        {listPost?.map((post) => (
                            <PetAdoptionCard key={post._id} post={post} />
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default PetAdoptionContainer
