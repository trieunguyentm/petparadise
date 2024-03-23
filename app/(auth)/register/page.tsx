import FormRegister from "@/components/form/FormRegister"

const Register = () => {
    return (
        <div>
            <div className="mt-10 flex justify-center font-semibold text-5xl text-brown-1">
                Welcome to Pet Paradise
            </div>
            <div className="mt-10 flex justify-center items-center">
                <div className="min-w-[450px] flex flex-col justify-center bg-white opacity-80 rounded-2xl px-8 pb-10">
                    <div className="mt-8 text-brown-1 text-4xl text-center font-medium">
                        Register
                    </div>
                    <FormRegister />
                </div>
            </div>
        </div>
    )
}

export default Register
