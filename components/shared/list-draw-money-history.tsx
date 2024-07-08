"use client"

import { IWithdrawalHistory } from "@/types"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import DrawMoneyHistoryDetail from "./draw-money-history-detail"
import { Bank } from "./dialog-refund-order"

const ListDrawMoneyHistory = ({
    drawMoneyHistories,
}: {
    drawMoneyHistories: IWithdrawalHistory[]
}) => {
    const router = useRouter()
    const [listDrawMoneyHistory, setListDrawMoneyHistory] =
        useState<IWithdrawalHistory[]>(drawMoneyHistories)
    const [listBank, setListBank] = useState<Bank[]>([])
    /** Snack Bar */
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
        <>
            <div className="flex flex-col gap-8">
                {listDrawMoneyHistory.map((item, index) => (
                    <DrawMoneyHistoryDetail drawMoneyHistory={item} key={index} listBank={listBank}/>
                ))}
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

export default ListDrawMoneyHistory
