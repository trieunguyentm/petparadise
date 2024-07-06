import { IUserDocument } from "@/types"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { convertISOToFormat } from "@/lib/utils"
import { Button } from "../ui/button"
import { ChangeEvent, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import SnackbarCustom from "../ui/snackbar"

const typePet = {
    dog: "Chó",
    cat: "Mèo",
    bird: "Chim",
    rabbit: "Thỏ",
    fish: "Cá",
    rodents: "Loài gặm nhấm",
    reptile: "Loài bò sát",
    other: "Khác",
}

const UserCardManage = ({ people }: { people: IUserDocument }) => {
    const router = useRouter()
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const [loadingBan, setLoadingBan] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [hours, setHours] = useState<number>(0)

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        // Ensure the input is a positive number
        if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
            setHours(Number(value))
        }
    }

    const handleBanUser = async () => {
        try {
            setLoadingBan(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/ban-user`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: people._id.toString(),
                    timeBan: hours,
                }),
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
                setShowDialog(false)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingBan(false)
        }
    }

    useEffect(() => {
        console.log(hours)
    })

    return (
        <div className="flex border-brown-1 border-2 py-2 px-2 rounded-xl">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="py-0">
                        <div className="flex flex-row gap-4 items-center">
                            <Image
                                // onClick={() => router.push(`/profile/${people.username}`)}
                                src={
                                    people.profileImage
                                        ? people.profileImage
                                        : "/assets/images/avatar.jpeg"
                                }
                                alt="avatar"
                                width={50}
                                height={50}
                                className="rounded-full border-2"
                                style={{ clipPath: "circle()" }}
                                priority
                            />
                            <div className="flex flex-col">
                                <div className="font-medium text-sm text-brown-1">
                                    {people.username}
                                </div>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                        <ul>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Tên người dùng:</span> {people.username}
                                </div>
                            </li>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Địa chỉ gmail:</span> {people.email}
                                </div>
                            </li>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Địa chỉ: </span>{" "}
                                    {people?.address || "Chưa cung cấp địa chỉ"}
                                </div>
                            </li>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Số dư tài khoản: </span>{" "}
                                    {people?.accountBalance
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    đ
                                </div>
                            </li>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Loại thú cưng quan tâm: </span>{" "}
                                    {people?.petTypeFavorites && people.petTypeFavorites.length > 0
                                        ? people.petTypeFavorites
                                              .map((type) => typePet[type])
                                              .join(", ")
                                        : "Chưa cung cấp thông tin"}
                                </div>
                            </li>
                            <li className="flex flex-row text-xs text-brown-1">
                                <div>
                                    <span>Tình trạng tài khoản: </span> {/** Tình trạng */}
                                    {!people.isBanned
                                        ? "Tài khoản không bị khóa"
                                        : `Tài khoản bị khóa đến thời điểm: ${convertISOToFormat(
                                              people.banExpiration || "",
                                          )}`}
                                </div>
                            </li>
                        </ul>
                        <div className="flex justify-end">
                            <Button variant={"destructive"} onClick={() => setShowDialog(true)}>
                                Khóa tài khoản
                            </Button>
                            <Dialog open={showDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Khóa tài khoản người dùng</DialogTitle>
                                        <DialogDescription>
                                            Sau khi khóa, tài khoản sẽ bị đăng xuất trên mọi thiết
                                            bị và không thể truy cập hệ thống
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <label
                                            htmlFor="blockHours"
                                            className="text-sm text-brown-1"
                                        >
                                            Thời gian khóa (tính bằng giờ)
                                        </label>
                                        <input
                                            type="number"
                                            id="blockHours"
                                            name="blockHours"
                                            value={hours}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Nhập thời gian"
                                            required
                                            className="border border-brown-1 focus:outline-none rounded-md py-3 px-1 text-sm text-brown-1"
                                        />
                                    </div>
                                    <DialogFooter className="flex flex-row gap-4">
                                        <Button
                                            variant={"destructive"}
                                            onClick={() => setShowDialog(false)}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            variant={"default"}
                                            onClick={handleBanUser}
                                            disabled={loadingBan || hours === 0}
                                        >
                                            {loadingBan ? (
                                                <Loader2 className="animate-spin w-8 h-8" />
                                            ) : (
                                                "Xác nhận"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default UserCardManage
