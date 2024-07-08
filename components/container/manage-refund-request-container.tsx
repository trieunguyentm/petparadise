import { IRefundRequestDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import RefundRequestDetail from "../shared/refund-request-detail"
import { Bank } from "../shared/dialog-refund-order"

const ManageRefundRequestContainer = ({
    refundRequests,
    user,
}: {
    refundRequests: IRefundRequestDocument[] | null
    user: IUserDocument
}) => {
    const router = useRouter()
    // List Refund Request
    const [listRefundRequest, setListRefundRequest] = useState<IRefundRequestDocument[]>(
        !refundRequests ? [] : refundRequests,
    )
    // List bank
    const [listBank, setListBank] = useState<Bank[]>([])
    // Snack Bar
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

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

    return (
        <div className="pt-4">
            {listRefundRequest.length === 0 ? (
                <div className="text-brown-1 w-full h-full flex justify-center">
                    Hiện tại không có yêu cầu hoàn tiền nào
                </div>
            ) : (
                <div className="flex flex- gap-8">
                    {listRefundRequest.map((refundRequest, index) => (
                        <RefundRequestDetail
                            refundRequest={refundRequest}
                            listBank={listBank}
                            key={index}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManageRefundRequestContainer
