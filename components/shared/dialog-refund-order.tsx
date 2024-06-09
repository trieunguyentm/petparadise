import { IOrderDocument, IRefundRequestDocument } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import Image from "next/image"
import { useDebouncedCallback } from "use-debounce"
import { Loader2, X } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export type Bank = {
    id: number
    name: string
    code: string
    bin: string
    shortName: string
    short_name: string
    logo: string
    transferSupported: number
    lookupSupported: number
    isTransfer: number
    support: number
    swift_code: string
}

const DialogRefundOrder = ({
    open,
    setOpen,
    order,
}: {
    open: number | null
    setOpen: (arg: number | null) => void
    order: IOrderDocument
}) => {
    const router = useRouter()
    const [listBank, setListBank] = useState<Bank[]>([])
    const [selectedBank, setSelectedBank] = useState<string | undefined>(undefined)
    const [accountNumber, setAccountNumber] = useState<string>("")
    const [accountName, setAccountName] = useState<string>("")
    const [refundRequest, setRefundRequest] = useState<IRefundRequestDocument | null>(null)
    /** Change disabled in accountName */
    const [disabledAccountName, setDisabledAccountName] = useState<boolean>(true)
    /** Loading */
    const [loadingAccountName, setLoadingAccountName] = useState<boolean>(false)
    const [loadingSendRequest, setLoadingSendRequest] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleBankChange = (value: string) => {
        setSelectedBank(value)
    }

    const handleChangeAccountNumber = useDebouncedCallback((text: string) => {
        setAccountNumber(text)
        setDisabledAccountName(true)
    }, 1000)

    const handleSendRequest = async () => {
        setLoadingSendRequest(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/refund-request/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        orderId: order._id.toString(),
                        bankCode: selectedBank,
                        bankName: accountName,
                        bankNumber: accountNumber,
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setOpen(null)
            }
        } catch (error) {
            console.error("Xảy ra lỗi khi tạo yêu cầu hoàn tiền: ", error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Xảy ra lỗi khi tạo yêu cầu hoàn tiền")
        } finally {
            setLoadingSendRequest(false)
        }
    }

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
                setContentSnackbar("Failed to fetch list bank")
            }
        }
        fetchListBank()
    }, [])

    useEffect(() => {
        if (accountNumber !== "" && selectedBank) {
            fetchAccountName()
        }
    }, [accountNumber, selectedBank])

    useEffect(() => {
        async function fetchRefundRequest() {
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/refund-request/get-refund-request-by-order/${order._id.toString()}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    },
                )
                const data = await res.json()
                if (!res.ok) {
                    setRefundRequest(null)
                }
                if (data.success) {
                    setRefundRequest(data.data as IRefundRequestDocument | null)
                }
            } catch (error) {
                setRefundRequest(null)
                console.log(error)
            }
        }
        fetchRefundRequest()
    }, [])

    return (
        <>
            <Dialog open={open === order.orderCode}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div
                            className="w-full flex justify-end cursor-pointer"
                            onClick={() => setOpen(null)}
                        >
                            <X />
                        </div>
                        <DialogTitle className="text-brown-1">Yêu cầu hoàn tiền</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin để nhận tiền hoàn lại từ đơn hàng.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-brown-1 font-semibold">Thông tin đơn hàng</div>
                        <ul className="text-xs">
                            <li>Mã đơn hàng: {order.orderCode}</li>
                            <li>
                                Số tiền hoàn:{" "}
                                {(order.totalAmount - (order.refund || 0))
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                đ
                            </li>
                        </ul>
                        {!refundRequest && (
                            <>
                                <div className="text-sm text-brown-1 font-semibold">
                                    Thông tin ngân hàng
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
                                                            <SelectItem
                                                                value={bank.code}
                                                                key={index}
                                                            >
                                                                <div className="flex gap-1">
                                                                    <Image
                                                                        src={bank.logo}
                                                                        alt="logo"
                                                                        width={40}
                                                                        height={40}
                                                                        style={{ height: "auto" }}
                                                                    />
                                                                    <div>
                                                                        {bank.name} (
                                                                        {bank.shortName})
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
                                                onChange={(e) =>
                                                    handleChangeAccountNumber(e.target.value)
                                                }
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
                            </>
                        )}
                        {!refundRequest ? (
                            <div className="w-full justify-center flex gap-2">
                                <Button
                                    disabled={
                                        selectedBank === undefined ||
                                        accountNumber === "" ||
                                        loadingAccountName
                                    }
                                    onClick={handleSendRequest}
                                >
                                    Gửi yêu cầu
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full justify-center flex gap-2">
                                <Button disabled={true}>Đã gửi yêu cầu hoàn tiền</Button>
                            </div>
                        )}
                    </div>
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

export default DialogRefundOrder
