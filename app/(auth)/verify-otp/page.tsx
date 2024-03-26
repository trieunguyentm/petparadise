import FormVerifyOTP from "@/components/form/FormVerifyOTP"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Verify OTP",
    description: "Verify OTP in Pet Paradise",
}

const VerifyOTP = () => {
    return (
        <div>
            <div className="mt-10 flex justify-center font-semibold text-5xl max-md:text-3xl text-brown-1">
                Welcome to Pet Paradise
            </div>
            <div className="mt-10 flex justify-center items-center">
                <div className="min-w-[450px] max-w-[450px] max-md:min-w-[100px] flex flex-col justify-center bg-white opacity-80 rounded-2xl px-8 max-sm:px-4 pb-10">
                    <div className="mt-8 text-brown-1 text-4xl max-md:text-3xl text-center font-medium">
                        VerifyOTP
                    </div>
                    <FormVerifyOTP />
                </div>
            </div>
        </div>
    )
}

export default VerifyOTP
