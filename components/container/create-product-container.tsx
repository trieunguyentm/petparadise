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
import { shopCategories, typePet } from "@/lib/data"
import { ChangeEvent, useState } from "react"
import { TypePet, TypeProduct } from "@/types"
import { useForm } from "react-hook-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import DatePickerDemo from "../shared/date-picker"
import { ImagePlus, Loader2, X } from "lucide-react"
import SnackbarCustom from "../ui/snackbar"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type FormValues = {
    nameProduct: string
    descriptionProduct: string
    priceProduct: string
    discountRate: string
    stock: string
    images: File[]
}

const CreateProductContainer = () => {
    const router = useRouter()
    /** React hook form */
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        setValue,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
    })
    /** Form */
    const [typeProduct, setTypeProduct] = useState<TypeProduct | null>(null)

    const [discountStartDate, setDiscountStartDate] = useState<Date | undefined>(undefined)
    const [discountEndDate, setDiscountEndDate] = useState<Date | undefined>(undefined)

    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    // Xử lý khi thay đổi giá
    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "") // Loại bỏ tất cả các ký tự không phải là số
        setValue("priceProduct", value.replace(/\B(?=(\d{3})+(?!\d))/g, "."))
    }
    // Đổi string sang number
    const getAsNumber = (data: string): number => {
        return parseInt(data?.replace(/\./g, ""), 10) // Xóa dấu chấm và chuyển giá về number
    }
    // Thêm emoji
    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setValue("descriptionProduct", watch("descriptionProduct") + emojiString)
    }
    // Thêm file ảnh
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("images", filesArray, { shouldValidate: true })
            // Tạo bản xem trước cho mỗi file ảnh
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }
    // Xóa ảnh
    const handleDeleteImage = (index: number) => {
        // Cập nhật danh sách các file ảnh đã chọn
        const updatedFiles = watch("images").filter((_: File, i: number) => i !== index)
        setValue("images", updatedFiles, { shouldValidate: true })

        // Cập nhật danh sách các URL xem trước ảnh
        const updatedPreviews = previewImages.filter((_: string, i: number) => i !== index)
        setPreviewImages(updatedPreviews)
    }

    const handleCreateProduct = async () => {
        // Get typeProduct
        if (!typeProduct) {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần cung cấp loại sản phẩm")
            setOpenSnackbar(true)
            return
        }
        // Get name
        const name = watch("nameProduct")
        if (name.trim() === "") {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền tên sản phẩm")
            setOpenSnackbar(true)
            return
        }
        // Get description
        const description = watch("descriptionProduct")
        if (description.trim() === "") {
            setTypeSnackbar("info")
            setContentSnackbar("Bạn cần điền mô tả sản phẩm")
            setOpenSnackbar(true)
            return
        }
        // Get price
        const price = getAsNumber(watch("priceProduct"))
        if (price < 0) {
            setTypeSnackbar("info")
            setContentSnackbar("Giá sản phẩm không hợp lệ")
            setOpenSnackbar(true)
            return
        }
        // Get discountRate
        const discountRate = getAsNumber(watch("discountRate"))
        if (discountRate < 0 || discountRate > 100) {
            setTypeSnackbar("info")
            setContentSnackbar("Tỉ lệ giảm giá không hợp lệ")
            setOpenSnackbar(true)
            return
        }
        // Thời gian bắt đầu và kết thúc khuyến mãi
        // Kiểm tra discountStartDate và discountEndDate
        if (discountRate > 0) {
            if (!discountStartDate || !discountEndDate) {
                setTypeSnackbar("info")
                setContentSnackbar("Bạn cần chọn thời gian bắt đầu và kết thúc giảm giá")
                setOpenSnackbar(true)
                return
            }
            if (discountStartDate >= discountEndDate) {
                setTypeSnackbar("info")
                setContentSnackbar("Thời gian bắt đầu phải sớm hơn thời gian kết thúc")
                setOpenSnackbar(true)
                return
            }
        }
        // Get stock
        const stock = parseInt(watch("stock"), 10)
        if (stock < 0) {
            setTypeSnackbar("info")
            setContentSnackbar("Số lượng sản phẩm không hợp lệ")
            setOpenSnackbar(true)
            return
        }
        // Get files
        const files = watch("images")
        if (files.length === 0) {
            setTypeSnackbar("info")
            setContentSnackbar("Hãy cung cấp hình ảnh mô tả sản phẩm")
            setOpenSnackbar(true)
            return
        }

        // Khởi tạo formData
        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("productType", typeProduct)
        formData.append("price", price.toString())
        formData.append("stock", stock.toString())
        formData.append("discountRate", discountRate.toString())
        if (discountRate > 0 && discountStartDate) {
            formData.append("discountStartDate", discountStartDate.toISOString().split("T")[0])
        }
        if (discountRate > 0 && discountEndDate) {
            formData.append("discountEndDate", discountEndDate.toISOString().split("T")[0])
        }
        files.forEach((file) => {
            formData.append("images", file)
        })

        // Send API
        setLoadingCreate(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/create`, {
                method: "POST",
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
                setTypeProduct(null)
                reset({
                    nameProduct: "",
                    descriptionProduct: "",
                    priceProduct: "0",
                    discountRate: "0",
                    stock: "0",
                    images: [],
                })
                setDiscountStartDate(undefined)
                setDiscountEndDate(undefined)
                setPreviewImages([])
            }
        } catch (error: any) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingCreate(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Loại sản phẩm */}
            <div className="flex flex-col gap-2">
                <label htmlFor="typeProduct" className="text-sm">
                    Loại sản phẩm của bạn là gì ? <span className="text-red-500">*</span>
                </label>
                <Select
                    value={typeProduct ? typeProduct : undefined}
                    onValueChange={(value: TypeProduct) => setTypeProduct(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại sản phẩm của bạn" />
                    </SelectTrigger>
                    <SelectContent id="typeProduct">
                        <SelectGroup>
                            <SelectLabel>Chọn loại sản phẩm của bạn</SelectLabel>
                            {shopCategories.map((category) => {
                                if (category.value !== "all") {
                                    return (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.text}
                                        </SelectItem>
                                    )
                                }
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/* Tên sản phẩm */}
            <div className="flex flex-col gap-2">
                <label htmlFor="nameProduct" className="text-sm">
                    Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("nameProduct", {
                        required: "Bạn cần điền thông tin tên sản phẩm",
                    })}
                    type="text"
                    name="nameProduct"
                    id="nameProduct"
                    placeholder="Nhập tên của sản phẩm"
                    className="focus:outline-none py-3 px-2 border rounded-md text-sm "
                />
                <div className="text-xs text-red-700">{errors.nameProduct?.message}</div>
            </div>
            {/* Mô tả sản phẩm */}
            <div className="flex flex-col gap-2">
                <label htmlFor="descriptionProduct" className="text-sm">
                    Mô tả sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <textarea
                        {...register("descriptionProduct", {
                            required: "Bạn cần điền mô tả của sản phẩm",
                        })}
                        name="descriptionProduct"
                        id="descriptionProduct"
                        rows={6}
                        className="text-sm resize-none w-full border rounded-md focus:outline-none py-3 px-2 pb-5"
                    />
                    <div className="absolute bottom-2 right-2 cursor-pointer">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div>
                                    <Image
                                        src={"/assets/images/smile-plus.svg"}
                                        alt="smile-plus"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Picker data={data} onEmojiSelect={addEmoji} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="text-xs text-red-700">{errors.descriptionProduct?.message}</div>
            </div>
            {/* Giá sản phẩm */}
            <div className="flex flex-col gap-2">
                <label htmlFor="priceProduct" className="text-sm">
                    Giá sản phẩm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("priceProduct", {
                        required: "Bạn cần điền giá sản phẩm",
                    })}
                    defaultValue={0}
                    type="text"
                    id="priceProduct"
                    onChange={handlePriceChange}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.priceProduct?.message}</div>
            </div>
            {/* Tỉ lệ giảm giá */}
            <div className="flex flex-col gap-2">
                <label htmlFor="discountRate" className="text-sm">
                    Tỉ lệ giảm giá (%)
                </label>
                <input
                    {...register("discountRate", {
                        validate: (value) => {
                            if (parseInt(value) < 0 || parseInt(value) > 100) {
                                return "Tỉ lệ giảm giá không phù hợp"
                            }
                        },
                    })}
                    type="number"
                    id="discountRate"
                    min={0}
                    max={100}
                    defaultValue={0}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.discountRate?.message}</div>
            </div>
            {/* Thời gian giảm giá */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="discountStartDate" className="text-sm">
                            Thời gian bắt đầu giảm giá
                        </label>
                        <DatePickerDemo
                            date={discountStartDate}
                            setDate={setDiscountStartDate}
                            label=""
                            selectAll={true}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="discountEndDate" className="text-sm">
                            Thời gian kết thúc giảm giá
                        </label>
                        <DatePickerDemo
                            date={discountEndDate}
                            setDate={setDiscountEndDate}
                            label=""
                            selectAll={true}
                        />
                    </div>
                </div>
            </div>
            {/* Số lượng sản phẩm */}
            <div className="flex flex-col gap-2">
                <label htmlFor="stock" className="text-sm">
                    Số lượng sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("stock", {
                        required: "Bạn cần điền số lượng sản phẩm",
                        validate: (value) => {
                            if (parseInt(value) < 0) {
                                return "Số lượng sản phẩm không phù hợp"
                            }
                        },
                    })}
                    type="number"
                    id="stock"
                    min={0}
                    defaultValue={0}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.stock?.message}</div>
            </div>
            {/* Hình ảnh mô tả sản phẩm */}
            <div className="flex flex-col gap-2">
                <label className="text-sm ">
                    Hãy cung cấp hình ảnh của sản phẩm <span className="text-red-500">*</span>
                </label>
                <label
                    htmlFor="images"
                    className="cursor-pointer transition-all hover:-translate-y-2"
                >
                    <ImagePlus className="text-brown-1 w-10 h-10" />
                </label>
                <input
                    {...register("images")}
                    type="file"
                    id="images"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={onFileChange}
                />
                {previewImages && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {previewImages.map((imageURL: string, index: number) => (
                            <div key={index} className="relative">
                                <Image
                                    className="rounded-md"
                                    src={imageURL}
                                    alt="preview image"
                                    width={500}
                                    height={500}
                                    priority
                                />
                                <Button
                                    variant={"ghost"}
                                    onClick={() => handleDeleteImage(index)}
                                    className="p-0 w-4 h-4 text-sm absolute -top-2 -right-2 text-red-600 bg-slate-400 rounded-full"
                                >
                                    <X />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* BUTTON Tạo sản phẩm */}
            <div className="flex w-full justify-center mt-10">
                <Button
                    onClick={handleCreateProduct}
                    className="transition-all hover:-translate-y-1.5"
                >
                    {loadingCreate ? <Loader2 className="w-8 h-8 animate-spin" /> : "Tạo sản phẩm"}
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

export default CreateProductContainer
