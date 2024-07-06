import React from "react"

const MainContainerAdmin = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-4/5 h-screen border-x border-brown-1">
            <div>{children}</div>
        </div>
    )
}

export default MainContainerAdmin
