"use client"

import { IProductDocument, TypeProduct } from "@/types"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { shopCategories } from "@/lib/data"
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

async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: mimeType })
}

const EditProductContainer = ({ product }: { product: IProductDocument }) => {
    const router = useRouter()
    /** React hook form */
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm<FormValues>({
        mode: "onChange",
    })
    /** Form */
    const [typeProduct, setTypeProduct] = useState<TypeProduct | null>(product.productType)
    const [discountStartDate, setDiscountStartDate] = useState<Date | undefined>(
        product.discountStartDate,
    )
    const [discountEndDate, setDiscountEndDate] = useState<Date | undefined>(
        product.discountEndDate,
    )
    const [previewImages, setPreviewImages] = useState<string[]>(product.images)
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false)

    useEffect(() => {
        const loadFiles = async () => {
            const filePromises = product.images.map((url, index) =>
                urlToFile(url, `image-${index}.jpg`, "image/jpeg"),
            )
            const files = await Promise.all(filePromises)
            setValue("images", files, { shouldValidate: true })
        }

        setValue("nameProduct", product.name)
        setValue("descriptionProduct", product.description)
        setValue("priceProduct", product.price.toString())
        setValue("discountRate", product.discountRate?.toString() || "0")
        setValue("stock", product.stock.toString())
        loadFiles()
    }, [product, setValue])

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "")
        setValue("priceProduct", value.replace(/\B(?=(\d{3})+(?!\d))/g, "."))
    }

    const getAsNumber = (data: string): number => {
        return parseInt(data?.replace(/\./g, ""), 10)
    }

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setValue("descriptionProduct", watch("descriptionProduct") + emojiString)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("images", filesArray, { shouldValidate: true })
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }

    const handleDeleteImage = (index: number) => {
        const updatedFiles = watch("images").filter((_: File, i: number) => i !== index)
        setValue("images", updatedFiles, { shouldValidate: true })
        const updatedPreviews = previewImages.filter((_: string, i: number) => i !== index)
        setPreviewImages(updatedPreviews)
    }

    const handleEditProduct = async () => {
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
            if (new Date(discountStartDate) >= new Date(discountEndDate)) {
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
            formData.append(
                "discountStartDate",
                new Date(discountStartDate).toISOString().split("T")[0],
            )
        }
        if (discountRate > 0 && discountEndDate) {
            formData.append(
                "discountEndDate",
                new Date(discountEndDate).toISOString().split("T")[0],
            )
        }
        files.forEach((file) => {
            formData.append("images", file)
        })

        // Send API
        setLoadingEdit(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${product._id.toString()}/edit`,
                {
                    method: "PUT",
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
                setTypeProduct(null)
                // Reload trang sau một khoảng thời gian ngắn để người dùng có thể nhìn thấy thông báo
                setTimeout(() => {
                    router.push(`/store/product-detail/${product._id.toString()}`)
                }, 1500) // Đợi 1.5 giây trước khi reload
            }
        } catch (error: any) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingEdit(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
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
                    className="focus:outline-none py-3 px-2 border rounded-md text-sm"
                />
                <div className="text-xs text-red-700">{errors.nameProduct?.message}</div>
            </div>
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
            <div className="flex flex-col gap-2">
                <label htmlFor="priceProduct" className="text-sm">
                    Giá sản phẩm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("priceProduct", {
                        required: "Bạn cần điền giá sản phẩm",
                    })}
                    defaultValue={product.price}
                    type="text"
                    id="priceProduct"
                    onChange={handlePriceChange}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.priceProduct?.message}</div>
            </div>
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
                    defaultValue={product.discountRate}
                    type="number"
                    id="discountRate"
                    min={0}
                    max={100}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.discountRate?.message}</div>
            </div>
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
                    defaultValue={product.stock}
                    type="number"
                    id="stock"
                    min={0}
                    className="text-sm border focus:outline-none rounded-md py-3 px-2"
                />
                <div className="text-xs text-red-700">{errors.stock?.message}</div>
            </div>
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
            <div className="flex w-full justify-center mt-10">
                <Button
                    onClick={handleEditProduct}
                    className="transition-all hover:-translate-y-1.5"
                >
                    {loadingEdit ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        "Chỉnh sửa sản phẩm"
                    )}
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

export default EditProductContainer
