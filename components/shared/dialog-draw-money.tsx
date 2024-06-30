import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useEffect, useState } from "react"
import { Bank } from "./dialog-refund-order"
import { useDebouncedCallback } from "use-debounce"
import Image from "next/image"
import SnackbarCustom from "../ui/snackbar"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { IUserDocument } from "@/types"

const DialogDrawMoney = ({
    user,
    showDialogDrawMoney,
    setShowDialogDrawMoney,
}: {
    user: IUserDocument | null
    showDialogDrawMoney: boolean
    setShowDialogDrawMoney: (arg: boolean) => void
}) => {
    const router = useRouter()
    const [listBank, setListBank] = useState<Bank[]>([])
    const [selectedBank, setSelectedBank] = useState<string | undefined>(undefined)
    const [accountNumber, setAccountNumber] = useState<string>("")
    const [accountName, setAccountName] = useState<string>("")
    /** Change disabled in accountName */
    const [disabledAccountName, setDisabledAccountName] = useState<boolean>(true)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Loading */
    const [loadingAccountName, setLoadingAccountName] = useState<boolean>(false)
    const [loadingSendRequest, setLoadingSendRequest] = useState<boolean>(false)

    const handleBankChange = (value: string) => {
        setSelectedBank(value)
    }

    const handleChangeAccountNumber = useDebouncedCallback((text: string) => {
        setAccountNumber(text)
        setDisabledAccountName(true)
    }, 1000)

    const fetchAccountName = async () => {
        setLoadingAccountName(true)

        try {
            if (selectedBank) {
                const bank: Bank[] = listBank.filter((bankTmp) => bankTmp.code === selectedBank)
                const res = await fetch(`https://api.vietqr.io/v2/lookup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": "demo-2a02822e-ede3-4970-999b-18853d8e0ced",
                        "X-Client-Id": "demo-a34a5775-ae15-4a05-8422-1023eccbda3f",
                    },
                    body: JSON.stringify({
                        bin: bank[0].bin,
                        accountNumber: accountNumber,
                    }),
                })
                const data = await res.json()
                if (!res.ok) {
                    setAccountName("")
                    setDisabledAccountName(false)
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar(data.desc)
                }

                if (data.data) {
                    setAccountName(data.data.accountName as string)
                } else {
                    setAccountName("")
                    setDisabledAccountName(false)
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar(data.desc)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingAccountName(false)
        }
    }

    const handleDrawMoney = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/create-request-draw-money`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        amount: user?.accountBalance || 0,
                        bankCode: selectedBank,
                        accountName: accountName,
                        accountNumber: accountNumber,
                    }),
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
                setContentSnackbar(data.message || "Xảy ra lỗi khi tạo yêu cầu hoàn tiền")
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setShowDialogDrawMoney(false)
                // Reload trang sau một khoảng thời gian ngắn để người dùng có thể nhìn thấy thông báo
                setTimeout(() => {
                    window.location.reload()
                }, 1500) // Đợi 1.5 giây trước khi reload
            }
        } catch (error) {
            console.error("Xảy ra lỗi khi tạo yêu cầu nhận tiền: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi khi tạo yêu cầu nhận tiền")
        } finally {
            setLoadingSendRequest(false)
        }
    }

    useEffect(() => {
        async function fetchListBank() {
            try {
                const res = await fetch(`https://api.vietqr.io/v2/banks`, {
                    method: "GET",
                })
                const data = await res.json()
                if (res.ok) {
                    setListBank(data.data as Bank[])
                }
            } catch (error) {
                console.error("Failed to fetch list bank: ", error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("Xảy ra lỗi khi tải danh sách ngân hàng")
            }
        }
        fetchListBank()
    }, [])

    useEffect(() => {
        if (accountNumber !== "" && selectedBank) {
            fetchAccountName()
        }
    }, [accountNumber, selectedBank])

    return (
        <>
            <Dialog open={showDialogDrawMoney}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Thông tin nhận tiền</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin để nhận tiền từ đơn hàng đã bán được.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-brown-1 font-semibold">
                            {`Thông tin nhận tiền (${user?.accountBalance
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ)`}
                        </div>
                        <ul className="text-xs flex flex-col gap-2">
                            <li className="flex flex-col gap-2">
                                <div>Tên ngân hàng</div>
                                <div>
                                    <Select
                                        disabled={listBank.length === 0}
                                        value={selectedBank}
                                        onValueChange={handleBankChange}
                                    >
                                        <SelectTrigger className="w-full text-xs p-1 focus:outline-none">
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        </SelectTrigger>
                                        <SelectContent className="text-xs focus:outline-none">
                                            <SelectGroup>
                                                {listBank.map((bank, index) => (
                                                    <SelectItem value={bank.code} key={index}>
                                                        <div className="flex gap-1">
                                                            <Image
                                                                src={bank.logo}
                                                                alt="logo"
                                                                width={40}
                                                                height={40}
                                                                style={{ height: "auto" }}
                                                            />
                                                            <div>
                                                                {bank.name} ({bank.shortName})
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </li>
                            <li className="flex flex-col gap-2">
                                <div>Số tài khoản</div>
                                <div>
                                    <input
                                        // value={accountNumber}
                                        onChange={(e) => handleChangeAccountNumber(e.target.value)}
                                        type="text"
                                        className="border focus:outline-none p-2 rounded-lg"
                                    />
                                </div>
                            </li>
                            <li className="flex flex-col gap-2">
                                <div>Tên chủ tài khoản</div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        disabled={disabledAccountName}
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        type="text"
                                        className="border focus:outline-none p-2 rounded-lg"
                                    />
                                    <div>
                                        {loadingAccountName && (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        )}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <DialogFooter>
                        <Button variant={"ghost"} onClick={() => setShowDialogDrawMoney(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDrawMoney}
                            disabled={
                                loadingSendRequest ||
                                !selectedBank ||
                                !accountName ||
                                !accountNumber
                            }
                        >
                            {loadingSendRequest ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                "Xác nhận"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default DialogDrawMoney
