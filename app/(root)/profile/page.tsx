"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

const Profile = () => {
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false)

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Manage Account</div>
                        <div>Manage your account information</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                            Profile
                        </div>
                        <div className="flex justify-between items-center p-5">
                            <Image
                                src={"/assets/images/avatar.jpeg"}
                                className="rounded-full"
                                alt="@shadcn"
                                width={140}
                                height={140}
                            />
                            <div className="flex flex-col gap-3 text-brown-1">
                                <div className="flex gap-2">
                                    <Image
                                        src={"/assets/images/circle-user-round.svg"}
                                        alt="user-round"
                                        width={25}
                                        height={25}
                                    />
                                    <div>@trieunguyentm</div>
                                </div>
                                <div className="flex gap-2">
                                    <Image
                                        src={"/assets/images/cake.svg"}
                                        alt="cake"
                                        width={25}
                                        height={25}
                                    />
                                    <div>2002-11-24</div>
                                </div>
                                <div className="flex gap-2">
                                    <Image
                                        src={"/assets/images/map-pin.svg"}
                                        alt="map-pin"
                                        width={25}
                                        height={25}
                                    />
                                    <div>Ha Noi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                            Account
                        </div>
                        <div className="py-5 flex flex-col text-brown-1 gap-2">
                            <div className="flex items-center">
                                <div className="w-1/6 font-medium">Username</div>
                                <div className="w-5/6 text-sm">trieunguyentm</div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-1/6 font-medium">Gmail</div>
                                <div className="w-5/6 text-sm">trieunguyentm</div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-1/6 font-medium">Password</div>
                                <div className="w-5/6 text-sm flex gap-4">
                                    <div>*************</div>
                                    <button onClick={() => setOpenChangePassword((prev) => !prev)}>
                                        <Image
                                            src={"/assets/images/pen-line.svg"}
                                            alt="pen-line"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {openChangePassword && (
                        <form className="flex flex-col gap-3 text-brown-1">
                            <label htmlFor="password" className="font-medium">
                                Current password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <label htmlFor="newPassword" className="font-medium">
                                New password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <label htmlFor="confirmPassword" className="font-medium">
                                Confirm new password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <div className="flex flex-row-reverse gap-3">
                                <Button type="submit">Change password</Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setOpenChangePassword((prev) => !prev)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
