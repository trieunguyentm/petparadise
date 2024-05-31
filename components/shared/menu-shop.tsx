"use client"

import { shopCategories } from "@/lib/data"
import React, { useState } from "react"

const MenuShop = ({ activeMenu, setActiveMenu }: { activeMenu: string; setActiveMenu: (arg: string) => void }) => {
    return (
        <div className="mt-8 border-y-2 border-brown-1 py-3 flex flex-wrap gap-3 justify-center">
            {shopCategories.map((category, index) => (
                <div
                    key={index}
                    className={`hover:bg-slate-300 p-4 rounded-2xl text-sm font-medium hover:cursor-pointer transition-all hover:-translate-y-1.5 ${
                        activeMenu === category.value && "bg-pink-1 drop-shadow-2xl"
                    }`}
                    onClick={() => setActiveMenu(category.value)}
                >
                    {category.text}
                </div>
            ))}
        </div>
    )
}

export default MenuShop
