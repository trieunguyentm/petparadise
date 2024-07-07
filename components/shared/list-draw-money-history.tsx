"use client"

import { IWithdrawalHistory } from "@/types"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import DrawMoneyHistoryDetail from "./draw-money-history-detail"

const ListDrawMoneyHistory = ({
    drawMoneyHistories,
}: {
    drawMoneyHistories: IWithdrawalHistory[]
}) => {
    const router = useRouter()
    const [listDrawMoneyHistory, setListDrawMoneyHistory] =
        useState<IWithdrawalHistory[]>(drawMoneyHistories)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    return (
        <>
            <div className="flex flex-col gap-8">
                {listDrawMoneyHistory.map((item, index) => (
                    <DrawMoneyHistoryDetail drawMoneyHistory={item} key={index} />
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
