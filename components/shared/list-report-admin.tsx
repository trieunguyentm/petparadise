"use client"

import { IReportDocument, IUserDocument } from "@/types"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useInView } from "react-intersection-observer"
import { USER_PER_PAGE } from "@/lib/data"
import ReportDetailAdmin from "./report-detail-admin"

const ListReportAdmin = ({
    reports,
    user,
}: {
    reports: IReportDocument[]
    user: IUserDocument
}) => {
    const router = useRouter()
    const [listReport, setListReport] = useState<IReportDocument[]>(reports)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    /** Load more */
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState(true)
    /** Intersection Observer */
    const { ref, inView } = useInView()

    const fetchMoreReport = useCallback(() => {
        setPage((prevPage) => prevPage + 1)
    }, [])

    useEffect(() => {
        async function loadMoreData() {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/admin/get-report?limit=${USER_PER_PAGE}&offset=${page * USER_PER_PAGE}`,
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
                setContentSnackbar(data.message || "Error loading more posts")
                return
            }
            if (data.success && data.data.length) {
                const newReport = data.data.filter(
                    (report: IReportDocument) => !listReport.some((r) => r._id === report._id),
                )
                setListReport((prev) => [...prev, ...newReport])
                setHasMore(data.data.length > 0)
            } else {
                setHasMore(false)
            }
        }

        if (page > 0) loadMoreData()
    }, [page])

    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreReport()
        }
    }, [inView])

    return (
        <>
            <div className="flex flex-col gap-8">
                {listReport.map((report, index) => (
                    <ReportDetailAdmin report={report} key={index} />
                ))}
            </div>
            <div ref={ref}></div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default ListReportAdmin
