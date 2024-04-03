const MainContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-3/5 h-screen border-x border-brown-1">
            <div>{children}</div>
        </div>
    )
}

export default MainContainer
