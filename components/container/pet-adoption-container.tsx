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

export type PetAdoptionStatus = "all" | "available" | "adopted"

export type PetReasonFind = "all" | "lost-pet" | "your-pet"

const filterTypePet = [
    { value: "all", text: "All" },
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
    {
        value: "all",
        text: "All",
    },
    {
        value: "male",
        text: "Male",
    },
    {
        value: "female",
        text: "Female",
    },
]

const filterSizePet = [
    { value: "all", text: "All" },
    { value: "small", text: "0kg - 5kg" },
    { value: "medium", text: "5kg - 15kg" },
    { value: "big", text: "> 15kg" },
]

const filterStatus = [
    { value: "all", text: "All" },
    { value: "available", text: "Available" },
    { value: "adopted", text: "Adopted" },
]

const filterReason = [
    { value: "all", text: "All" },
    { value: "lost-pet", text: "Find owners for lost pets" },
    { value: "your-pet", text: "Find a new owner" },
]

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

const PetAdoptionContainer = () => {
    const router = useRouter()
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
                    <div className="text-sm text-brown-1 font-semibold">Pet type</div>
                    <Select
                        onValueChange={(value: TypePet) => setTypePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type pet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a pet type</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Pet gender</div>
                    <Select
                        onValueChange={(value: GenderPet) => setGenderPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a pet gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a status pet</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Size pet</div>
                    <Select
                        onValueChange={(value: SizePet) => setSizePet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a size pet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a size pet</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Status</div>
                    <Select
                        onValueChange={(value: PetAdoptionStatus) => setStatusPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a status</SelectLabel>
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
                    <div className="text-sm text-brown-1 font-semibold">Reason find</div>
                    <Select
                        onValueChange={(value: PetReasonFind) => setReasonFindPet(value)}
                        defaultValue="all"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a reason</SelectLabel>
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
                    Search
                </Button>
            </div>
            <div className="w-full mt-5">
                <Button
                    onClick={() => router.push("/pet-adoption/create-post")}
                    className="w-full bg-green-300 text-black hover:text-white"
                >
                    Create a new post to find a pet owner &nbsp;
                    <MessageCirclePlus className="w-4 h-4" />
                </Button>
            </div>
            {/* DATA POST FIND OWNER */}
        </>
    )
}

export default PetAdoptionContainer
