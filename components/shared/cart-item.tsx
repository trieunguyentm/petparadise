import { IProductDocument } from "@/types"
import { CircleMinus, CirclePlus, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

const typePetToText = {
    food: "Đồ ăn",
    toys: "Đồ chơi",
    medicine: "Thuốc",
    accessories: "Phụ kiện",
    housing: "Nhà ở",
    training: "Huấn luyện",
    other: "Khác",
}

const CartItem = ({
    item,
    onDecrease,
    onIncrease,
    onRemove,
}: {
    item: { name: string; quantity: number; price: number; product: IProductDocument }
    onDecrease: () => void
    onIncrease: () => void
    onRemove: () => void
}) => {
    const [openAlert, setOpenAlert] = useState<boolean>(false)

    return (
        <div className="flex md:justify-between max-md:flex-col max-md:gap-2">
            <div className="flex items-center gap-2">
                <Image
                    src={item.product.images[0]}
                    alt="image-product"
                    width={150}
                    height={150}
                    className="border rounded-xl p-2"
                />
                <div className="flex flex-col">
                    <Link
                        href={`/store/product-detail/${item.product._id.toString()}`}
                        className="text-base font-medium text-brown-1"
                    >
                        {item.product.name}
                    </Link>
                    <div className="text-xs">
                        Loại sản phẩm: {typePetToText[item.product.productType]}
                    </div>
                    <div className="text-xs">
                        Giá sản phẩm:{" "}
                        {item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center text-brown-1">
                <div className="flex gap-1 items-center">
                    <CircleMinus className="w-4 h-4 cursor-pointer" onClick={onDecrease} />
                    <div className="m-1">{item.quantity}</div>
                    <CirclePlus className="w-4 h-4 cursor-pointer" onClick={onIncrease} />
                </div>
                <div>
                    <Trash className="w-5 h-5 cursor-pointer" onClick={() => setOpenAlert(true)} />
                </div>
            </div>
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onRemove}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CartItem
