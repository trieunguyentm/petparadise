import { Rubik } from "next/font/google"
import "../globals.css"

const rubik = Rubik({ subsets: ["latin"] })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${rubik.className} bg-no-repeat bg-cover bg-fixed bg-center bg-[url('/auth.png')]`}
            >
                {children}
            </body>
        </html>
    )
}
