import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"
import FindPetCard from "../shared/find-pet-card"
import LocationSelector from "../shared/location-selector"
import DatePickerDemo from "../shared/date-picker"
import { Button } from "../ui/button"
import { Loader2, MessageCirclePlus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ILostPetPostDocument } from "@/types"
import SnackbarCustom from "../ui/snackbar"
import { useInView } from "react-intersection-observer"
import { POST_PER_PAGE } from "@/lib/data"

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

const FindPetContainer = ({ findPetPosts }: { findPetPosts: ILostPetPostDocument[] | null }) => {
    // ROUTER
    const router = useRouter()
    // Load more
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadingMoreData, setLoadingMoreData] = useState<boolean>(false)
    const { ref, inView } = useInView()
    // List Post
    const [listPost, setListPost] = useState<ILostPetPostDocument[] | null>(findPetPosts)
    // FILTER PET
    const [typePet, setTypePet] = useState<TypePet>("all")
    const [genderPet, setGenderPet] = useState<GenderPet>("all")
    const [sizePet, setSizePet] = useState<SizePet>("all")
    const [locationPet, setLocationPet] = useState<LocationPet>(initialLocationState)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleSelectTypePet = (value: TypePet) => {
        setTypePet(value)
    }

    const handleSelectGenderPet = (value: GenderPet) => {
        setGenderPet(value)
    }

    const handleSelectSizePet = (value: SizePet) => {
        setSizePet(value)
    }

    const handleSearchPost = async () => {
        try {
            let apiEndpoint: string = `${
                process.env.NEXT_PUBLIC_BASE_URL
            }/api/lost-pet/find-pet-post-by-search?petType=${typePet}&gender=${genderPet}&size=${sizePet}&lastSeenLocation=${
                locationPet.cityName + "-" + locationPet.districtName + "-" + locationPet.wardName
            }`
            if (selectedDate) apiEndpoint += `&lastSeenDate=${selectedDate}`
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
                setListPost(data.data as ILostPetPostDocument[])
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    const fetchMorePosts = useCallback(() => {
        setPage((prev) => prev + 1)
    }, [])

    useEffect(() => {
        async function loadMoreData() {
            setLoadingMoreData(true)
            try {
                if (!listPost) return
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/lost-pet/find-pet-post?limit=${POST_PER_PAGE}&offset=${
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
                    setContentSnackbar(data.message || "Xảy ra lỗi khi tải thêm dữ liệu")
                    return
                }
                if (data.success && data.data.length > 0) {
                    const newPosts = data.data.filter(
                        (post: ILostPetPostDocument) =>
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
                setContentSnackbar("Có lỗi xảy ra khi tải thêm dữ liệu")
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
            {" "}
            {/* FILTER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                {/* TYPE PET */}
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-brown-1 font-semibold">Loại thú cưng</div>
                    <Select onValueChange={handleSelectTypePet} defaultValue="all">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại thú cưng cần tìm kiếm" />
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
                    <div className="text-sm text-brown-1 font-semibold">Giới tính thú cưng</div>
                    <Select onValueChange={handleSelectGenderPet} defaultValue="all">
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
                    <Select onValueChange={handleSelectSizePet} defaultValue="all">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn kích thước thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn kích thước của thú cưng</SelectLabel>
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
                <Button onClick={handleSearchPost} className="w-full bg-brown-1">
                    Tìm kiếm
                </Button>
            </div>
            <div className="w-full mt-5">
                <Button
                    onClick={() => router.push("/find-pet/create-post")}
                    className="w-full bg-green-500 text-black hover:text-white line-clamp-1 flex"
                >
                    Tạo một bài viết mới để tìm kiếm thú cưng &nbsp;
                    <MessageCirclePlus className="w-4 h-4 max-sm:hidden" />
                </Button>
            </div>
            {/* DATA PET */}
            {!listPost || listPost.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center mt-10">
                    Hiện tại chưa có bài viết tìm kiếm thú cưng nào
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-16 pb-10 gap-4">
                        {listPost?.map((post) => (
                            <FindPetCard key={post._id} post={post} />
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

export default FindPetContainer
