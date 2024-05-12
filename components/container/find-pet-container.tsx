import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import FindPetCard from "../shared/find-pet-card"
import LocationSelector from "../shared/location-selector"
import DatePickerDemo from "../shared/date-picker"
import { Button } from "../ui/button"
import { MessageCirclePlus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ILostPetPostDocument } from "@/types"

export type TypePet =
    | "all"
    | "dog"
    | "cat"
    | "bird"
    | "rabbit"
    | "fish"
    | "rodents"
    | "reptile"
    | "other"
export type GenderPet = "all" | "male" | "female"
export type SizePet = "all" | "small" | "medium" | "big"
export type LocationPet = {
    cityName: string
    districtName: string
    wardName: string
}

const initialLocationState: LocationPet = { cityName: "", districtName: "", wardName: "" }

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

const FindPetContainer = ({ findPetPosts }: { findPetPosts: ILostPetPostDocument[] | null }) => {
    // ROUTER
    const router = useRouter()
    // FILTER PET
    const [typePet, setTypePet] = useState<TypePet>("all")
    const [genderPet, setGenderPet] = useState<GenderPet>("all")
    const [sizePet, setSizePet] = useState<SizePet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const handleSelectTypePet = (value: TypePet) => {
        setTypePet(value)
    }

    const handleSelectGenderPet = (value: GenderPet) => {
        setGenderPet(value)
    }

    const handleSelectSizePet = (value: SizePet) => {
        setSizePet(value)
    }
    return (
        <>
            {" "}
            {/* FILTER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                {/* TYPE PET */}
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Pet type</div>
                    <Select onValueChange={handleSelectTypePet} defaultValue="all">
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
                    <Select onValueChange={handleSelectGenderPet} defaultValue="all">
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
                    <Select onValueChange={handleSelectSizePet} defaultValue="all">
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
                <DatePickerDemo
                    date={selectedDate}
                    setDate={setSelectedDate}
                    label="Thời gian bị mất"
                />
            </div>
            <div className="w-full mt-5">
                <Button className="w-full bg-brown-1">Search</Button>
            </div>
            <div className="w-full mt-5">
                <Button
                    onClick={() => router.push("/find-pet/create-post")}
                    className="w-full bg-green-300 text-black hover:text-white"
                >
                    Create a new post to find your pet &nbsp;
                    <MessageCirclePlus className="w-4 h-4" />
                </Button>
            </div>
            {/* DATA PET */}
            {!findPetPosts ? (
                <div className="w-full h-full flex items-center justify-center mt-10">
                    There are currently no pet search posts
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-16 pb-10 gap-4">
                        {findPetPosts?.map((post) => (
                            <FindPetCard key={post._id} post={post} />
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default FindPetContainer
