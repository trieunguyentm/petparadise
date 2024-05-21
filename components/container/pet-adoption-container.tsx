import React, { useCallback, useEffect, useState } from "react"
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
import { Loader2, MessageCirclePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { IPetAdoptionPostDocument } from "@/types"
import PetAdoptionCard from "../shared/pet-adoption-card"
import SnackbarCustom from "../ui/snackbar"
import { useInView } from "react-intersection-observer"
import { POST_PER_PAGE } from "@/lib/data"

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
    // Load more
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadingMoreData, setLoadingMoreData] = useState<boolean>(false)
    const { ref, inView } = useInView()
    // FILTER PET
    const [typePet, setTypePet] = useState<TypePet>("all")
    const [genderPet, setGenderPet] = useState<GenderPet>("all")
    const [sizePet, setSizePet] = useState<SizePet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const [statusPet, setStatusPet] = useState<PetAdoptionStatus>("all")
    const [reasonFindPet, setReasonFindPet] = useState<PetReasonFind>("all")
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const fetchMorePosts = useCallback(() => {
        setPage((prev) => prev + 1)
    }, [])

    const handleSearchPost = async () => {
        console.log(typePet)
        console.log(genderPet)
        console.log(sizePet)
        console.log(locationPet)
        console.log(statusPet)
        console.log(reasonFindPet)
        try {
            let apiEndpoint: string = `${
                process.env.NEXT_PUBLIC_BASE_URL
            }/api/pet-adoption/pet-adoption-post-by-search?petType=${typePet}&gender=${genderPet}&size=${sizePet}&location=${
                locationPet.cityName + "-" + locationPet.districtName + "-" + locationPet.wardName
            }&status=${statusPet}&reason=${reasonFindPet}`
            const res = await fetch(`${apiEndpoint}`, {
                method: "GET",
                credentials: "include",
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
                setListPost(data.data as IPetAdoptionPostDocument[])
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        }
    }

    useEffect(() => {
        async function loadMoreData() {
            setLoadingMoreData(true)
            try {
                if (!listPost) return
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/pet-adoption/pet-adoption-post?limit=${POST_PER_PAGE}&offset=${
                        page * POST_PER_PAGE
                    }`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
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
                    setContentSnackbar(data.message || "Error loading more posts")
                    return
                }
                if (data.success && data.data.length > 0) {
                    const newPosts = data.data.filter(
                        (post: IPetAdoptionPostDocument) =>
                            !listPost?.some((p) => p._id.toString() === post._id.toString()),
                    )
                    const tmp = [...listPost, ...newPosts]
                    setListPost(tmp)
                    setHasMore(data.data.length > 0)
                } else {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Failed to fetch more data")
            } finally {
                setLoadingMoreData(false)
            }
        }
        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMorePosts()
        }
    }, [inView])

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
                <Button onClick={handleSearchPost} className="w-full bg-brown-1">
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
            <div ref={ref} className="w-full flex justify-center py-5">
                {loadingMoreData && <Loader2 className="w-8 h-8 animate-spin" />}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default PetAdoptionContainer
