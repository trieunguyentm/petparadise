import FormRecoveryPassword from "@/components/form/FormRecoveryPassword"

const RecoveryPassword = () => {
    return (
        <div>
            <div className="mt-10 flex justify-center font-semibold text-5xl max-md:text-3xl text-brown-1">
                Welcome to Pet Paradise
            </div>
            <div className="mt-10 flex justify-center items-center">
                <div className="min-w-[450px] flex flex-col justify-center bg-white opacity-80 rounded-2xl px-8 pb-10 max-w-[450px]">
                    <div className="mt-8 text-brown-1 text-4xl max-md:text-3xl text-center font-medium">
                        Recovery Password
                    </div>
                    <FormRecoveryPassword />
                </div>
            </div>
        </div>
    )
}

export default RecoveryPassword
