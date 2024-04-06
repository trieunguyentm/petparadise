"use client"

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
import FindPetCard from "./find-pet-card"

export type TypePet = "all" | "dog" | "cat" | "other"
export type StatusPet = "all" | "lost" | "findOwner" | "findNewOwner"
export type LocationPet = "all" | string

const FilterFindPet = () => {
    const [typePet, setTypePet] = useState<TypePet>("all")
    const [statusPet, setStatusPet] = useState<StatusPet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>("all")

    const handleSelectTypePet = (value: TypePet) => {
        setTypePet(value)
    }

    const handleSelectStatusPet = (value: StatusPet) => {
        setStatusPet(value)
    }

    const handleSelectLocationPet = (value: LocationPet) => {
        setLocationPet(value)
    }

    return (
        <>
            {/* FILTER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Type pet</div>
                    <Select onValueChange={handleSelectTypePet}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type pet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="h-[100px]">
                                <SelectLabel>Select a type pet</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="dog">Dog</SelectItem>
                                <SelectItem value="cat">Cat</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Status pet</div>
                    <Select onValueChange={handleSelectStatusPet}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status pet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="h-[100px]">
                                <SelectLabel>Select a status pet</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="lost">Lost pets</SelectItem>
                                <SelectItem value="findOwner">Find the pet's owner</SelectItem>
                                <SelectItem value="findNewOwner">
                                    Find new owners for pets
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Location</div>
                    <Select onValueChange={handleSelectLocationPet}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="h-[100px]">
                                <SelectLabel>Select a location</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* DATA PET */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-4">
                <FindPetCard />
                <FindPetCard />
                <FindPetCard />
                <FindPetCard />
                <FindPetCard />
                <FindPetCard />
            </div>
        </>
    )
}

export default FilterFindPet
