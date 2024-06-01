"use client"

import { IPetAdoptionPostDocument, ITransferContractDocument, IUserDocument } from "@/types"
import { ArrowLeft, Check, FilePenLine, Loader2 } from "lucide-react"
import Image from "next/image"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"
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

const sizePet = {
    big: "> 15kg",
    medium: "5kg - 15kg",
    small: "0 - 5kg",
}

const PetAdoptionPostConfirm = ({
    post,
    user,
    adoptedPetOwner,
}: {
    post: IPetAdoptionPostDocument
    user: IUserDocument
    adoptedPetOwner: IUserDocument
}) => {
    const router = useRouter()
    const [transferContract, setTransferContract] = useState<ITransferContractDocument | null>(null)
    const [loadingTransfer, setLoadingTransfer] = useState<boolean>(true)
    const [openConfirmOldOwner, setOpenConfirmOldOwner] = useState<boolean>(false)
    const [openConfirmNewOwner, setOpenConfirmNewOwner] = useState<boolean>(false)
    const [loadingType, setLoadingType] = useState<1 | 2 | 3>(1)
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleConfirm = async (type: 1 | 2 | 3, confirmed: boolean) => {
        setLoadingType(type)
        setLoadingStatus(true)

        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/pet-adoption/${post._id.toString()}/confirm`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        confirmed: confirmed,
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
                setContentSnackbar(data.message)
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setOpenConfirmNewOwner(false)
                setOpenConfirmOldOwner(false)
                setTransferContract(data.data)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingType(1)
            setLoadingStatus(false)
        }
    }

    useEffect(() => {
        const fetchTransferContract = async () => {
            try {
                setLoadingTransfer(true)
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/pet-adoption/${post._id.toString()}/confirm`,
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
                    setContentSnackbar(data.message)
                }
                if (data.success) {
                    setTransferContract(data.data)
                }
            } catch (error) {
                console.log(error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("An error occurred, please try again")
            } finally {
                setLoadingTransfer(false)
            }
        }
        fetchTransferContract()
    }, [])

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col text-brown-1">
                        <div
                            onClick={() => router.push(`/pet-adoption/${post._id.toString()}`)}
                            className="mb-1 cursor-pointer"
                        >
                            <ArrowLeft />
                        </div>
                    </div>
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Xác nhận gửi/nhận thú cưng</div>
                    </div>
                    <h1 className="text-xl mt-6 font-semibold">Thông tin thú cưng</h1>
                    <div className="mt-3">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Trạng thái: </span>
                                    {post.status === "available" ? (
                                        <span className="text-yellow-500">
                                            Chưa có người nhận nuôi
                                        </span>
                                    ) : (
                                        <span className="text-green-500">
                                            Đã có người nhận nuôi
                                        </span>
                                    )}
                                </div>
                            </li>
                            {post.status === "adopted" && (
                                <li>
                                    <div className="text-sm flex">
                                        &bull;&nbsp;
                                        <span className="font-semibold">Người nhận nuôi:</span>
                                        &nbsp;{adoptedPetOwner.username}
                                    </div>
                                </li>
                            )}
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Loại thú cưng: </span>{" "}
                                    {typePet[post.petType]}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Kích thước: </span>{" "}
                                    {sizePet[post.sizePet] || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Vị trí hiện tại của thú cưng:{" "}
                                    </span>
                                    {post.location || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Lí do cần tìm chủ cho thú cưng:{" "}
                                    </span>
                                    {post.reason === "lost-pet" ? (
                                        <span>Tìm chủ cho thú cưng đi lạc/ bỏ rơi</span>
                                    ) : (
                                        <span>
                                            Tìm chủ mới cho thú cưng do hiện tại không thể tiếp tục
                                            chăm sóc
                                        </span>
                                    )}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Tình trạng sức khỏe của thú cưng:{" "}
                                    </span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: post.healthInfo.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Mô tả chi tiết về thú cưng và các yêu cầu khi chăm sóc:{" "}
                                    </span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: post.description.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Thông tin liên hệ riêng: </span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: post.contactInfo.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Hình ảnh đi kèm của thú cưng:{" "}
                                    </span>
                                </div>
                                <div>
                                    {post.images.length > 0 && (
                                        <Swiper
                                            className="bg-white border-b"
                                            pagination={true}
                                            modules={[Pagination]}
                                        >
                                            {post.images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <Image
                                                        src={image}
                                                        alt="image post"
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                        className="w-full h-auto"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <h1 className="text-xl mt-6 font-semibold">Xác nhận gửi/nhận thú cưng</h1>
                    <div className="flex flex-row max-md:flex-col justify-between mt-6">
                        <div>
                            <div className="text-sm">
                                &bull;{`Chủ hiện tại của thú cưng (` + post.poster.username + `)`}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    {`Tình trạng: `}
                                    {transferContract?.giverConfirmed ? (
                                        <span className="text-green-500">Đã gửi thú cưng</span>
                                    ) : (
                                        <span className="text-gray-500">Chưa gửi thú cưng</span>
                                    )}
                                </div>
                                {user._id.toString() === post.poster._id.toString() &&
                                    transferContract &&
                                    !transferContract.giverConfirmed &&
                                    transferContract.status !== "cancelled" && (
                                        <FilePenLine
                                            className="w-5 h-5 cursor-pointer hover:opacity-50"
                                            onClick={() => setOpenConfirmOldOwner(true)}
                                        />
                                    )}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm">
                                &bull;{`Chủ mới của thú cưng (` + adoptedPetOwner.username + `)`}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    {`Tình trạng: `}
                                    {transferContract?.receiverConfirmed ? (
                                        <span className="text-green-500">
                                            Xác nhận nuôi thú cưng
                                        </span>
                                    ) : transferContract?.status === "cancelled" ? (
                                        <span className="text-red-500">
                                            Không thể nuôi thú cưng
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">Chưa xác nhận</span>
                                    )}
                                </div>
                                {user._id.toString() === adoptedPetOwner._id.toString() &&
                                    transferContract &&
                                    !transferContract.receiverConfirmed &&
                                    transferContract.status !== "cancelled" && (
                                        <FilePenLine
                                            className="w-5 h-5 cursor-pointer hover:opacity-50"
                                            onClick={() => setOpenConfirmNewOwner(true)}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                    <AlertDialog open={openConfirmOldOwner}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận đã giao thú cưng?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Sau khi xác nhận đã giao thì sẽ không thể hủy xác nhận, vui lòng
                                    đồng ý xác nhận đã giao thú cưng khi bạn đã giao thú cưng cho
                                    chủ nhân mới
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenConfirmOldOwner(false)}>
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleConfirm(1, true)}
                                    disabled={loadingStatus && loadingType === 1}
                                >
                                    {loadingStatus && loadingType === 1 ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        "Xác nhận"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={openConfirmNewOwner}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận nuôi thú cưng?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Sau khi xác nhận đồng ý nuôi thú cưng, chủ hiện tại của thú cưng
                                    sẽ nhận được thông báo và hai bạn sẽ tiến hành trao nhận thú
                                    cưng.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenConfirmNewOwner(false)}>
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleConfirm(2, true)}
                                    disabled={loadingStatus && loadingType === 2}
                                >
                                    {loadingStatus && loadingType === 2 ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        "Xác nhận đồng ý nuôi"
                                    )}
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={() => handleConfirm(3, false)}
                                    disabled={loadingStatus && loadingType === 3}
                                >
                                    {loadingStatus && loadingType === 3 ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        "Xác nhận không nuôi"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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

export default PetAdoptionPostConfirm
