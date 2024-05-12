import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { LocationPet } from "../container/find-pet-container"

export type City = { Id: string; Name: string; Districts: District[] }

export type District = { Id: string; Name: string; Wards: Ward[] }

export type Ward = { Id: string; Name: string; Level: string }

const LocationSelector = ({ setLocationPet }: { setLocationPet: (arg: LocationPet) => void }) => {
    // Ban đầu các options của city, district, ward đều là mảng []
    // City Options
    const [cityOptions, setCityOptions] = useState<City[]>([])
    // District Options
    const [districtOptions, setDistrictOptions] = useState<District[]>([])
    // Ward Options
    const [wardOptions, setWardOptions] = useState<Ward[]>([])
    // Các lựa chọn ban đầu đều là ""
    const [selectedCityId, setSelectedCityId] = useState<string>("00")
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>("000")
    const [selectedWardId, setSelectedWardId] = useState<string>("00000")

    useEffect(() => {
        // Lần đầu tải trang thì sẽ cần tải các city options
        const fetchLocationData = async () => {
            const response = await fetch(
                "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
            )
            const data: City[] = await response.json()
            setCityOptions(data)
        }
        fetchLocationData()
    }, [])

    useEffect(() => {
        // Mỗi khi selectedCityId thay đổi và khác "" thì cần reset Id của distric, ward, cập nhật lại options của district và ward
        if (selectedCityId !== "00") {
            const selectedCity = cityOptions.find((city) => city.Id === selectedCityId)
            if (selectedCity && selectedCity.Districts) {
                setSelectedDistrictId("000")
                setSelectedWardId("00000")
                setDistrictOptions(selectedCity.Districts)
                setWardOptions([])
            }
        } else {
            setSelectedDistrictId("000")
            setSelectedWardId("00000")
            setDistrictOptions([])
            setWardOptions([])
        }
    }, [selectedCityId])

    useEffect(() => {
        // Mỗi khi selectedDistrictId thay đổi và khác "" thì cần reset lại Id của ward, cập nhật lại ward options
        if (selectedDistrictId !== "000") {
            const selectedCity = cityOptions.find((city) => city.Id === selectedCityId)
            const selectedDistrict = selectedCity?.Districts?.find(
                (district) => district.Id === selectedDistrictId,
            )
            if (selectedDistrict && selectedDistrict.Wards) {
                setSelectedWardId("00000")
                setWardOptions(selectedDistrict.Wards)
            }
        } else {
            setSelectedWardId("00000")
            setWardOptions([])
        }
    }, [selectedDistrictId])

    useEffect(() => {
        const selectedCity = cityOptions.find((city) => city.Id === selectedCityId)
        const selectedDistrict = selectedCity?.Districts.find(
            (district) => district.Id === selectedDistrictId,
        )
        const selectedWard = selectedDistrict?.Wards.find((ward) => ward.Id === selectedWardId)

        setLocationPet({
            cityName: selectedCity?.Name || "",
            districtName: selectedDistrict?.Name || "",
            wardName: selectedWard?.Name || "",
        })
    }, [selectedCityId, selectedDistrictId, selectedWardId])

    return (
        <>
            {/* CITY */}
            <div className="flex flex-col gap-1">
                <div className="text-sm text-brown-1 font-semibold">Tỉnh/thành</div>
                <Select onValueChange={(value) => setSelectedCityId(value)} value={selectedCityId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select a City</SelectLabel>
                            <SelectItem value="00">Chọn tỉnh/thành phố</SelectItem>
                            {cityOptions.map((city) => (
                                <SelectItem key={city.Id} value={city.Id}>
                                    {city.Name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/* DISTRICT */}
            <div className="flex flex-col gap-1">
                <div className="text-sm text-brown-1 font-semibold">Quận/huyện</div>
                <Select
                    onValueChange={(value) => setSelectedDistrictId(value)}
                    value={selectedDistrictId}
                    disabled={selectedCityId === "00"}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select a District</SelectLabel>
                            <SelectItem value="000">Chọn quận/huyện</SelectItem>
                            {districtOptions.map((district) => (
                                <SelectItem key={district.Id} value={district.Id}>
                                    {district.Name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/* WARD */}
            <div className="flex flex-col gap-1">
                <div className="text-sm text-brown-1 font-semibold">Phường/xã</div>
                <Select
                    onValueChange={(value) => setSelectedWardId(value)}
                    value={selectedWardId}
                    disabled={selectedDistrictId === "000"}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a ward" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select a Ward</SelectLabel>
                            <SelectItem value="00000">Chọn phường/xã</SelectItem>
                            {wardOptions.map((ward) => (
                                <SelectItem key={ward.Id} value={ward.Id}>
                                    {ward.Name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

export default LocationSelector
