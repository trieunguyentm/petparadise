import { Be_Vietnam_Pro, Rubik } from "next/font/google"
import "../globals.css"

const vietnamese = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${vietnamese.className} bg-no-repeat bg-cover bg-fixed bg-center bg-[url('/assets/background/auth.png')]`}
            >
                {children}
            </body>
        </html>
    )
}
