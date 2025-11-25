'use client'

import { useForm } from "@tanstack/react-form";
import { authClient } from "../../authClient";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignInPage() {
    const rt = useRouter()

    const {isPending} = authClient.useSession()
    
    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        onSubmit: async ({value, formApi}) => {
            formApi.reset()
            await authClient.signIn.email(
                {
                    email: value.email,
                    password: value.password
                },
                {
                    onSuccess: () => {
                        rt.push('/')
                    },
                    onError: (e) => {
                        console.error(e.error.message)
                    }
                }
            )
        }
    })

    const Field = form.Field

    return (
        <div className="w-full h-full flex justify-center items-center bg-[#252525]">
            <div className="w-full max-w-120 flex flex-col gap-6 p-6 rounded-2xl bg-[#383838]">
                <div className="flex flex-col gap-2 items-center">
                    <p className="text-transparent text-[40px] font-black bg-clip-text bg-linear-to-br from-[#D9D9D9] to-[#737373]">RUGRAM</p>
                    <p className="text-[#A8A8A8] text-2xl font-bold">ВХОД</p>
                </div>
                <div className="flex flex-col gap-5 items-center">
                    <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-8 w-full"
                    >
                        <div className="flex flex-col gap-3">
                            <Field 
                            name="email"
                            children={(f) => (
                                <div className="flex flex-col gap-2" key={f.name}>
                                    <label className="font-medium text-[12px]" htmlFor={f.name}>
                                        ЛОГИН (<strong>EMAIL</strong>)
                                    </label>
                                    <input 
                                    type="email"
                                    placeholder="Введите логин"
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    onBlur={f.handleBlur} 
                                    className="bg-[#2F2F2F] text-white text-[12px] p-2 focus:outline-white rounded-lg outline-transparent outline-px"
                                    />
                                </div>
                            )}
                            />
                            <Field 
                            name="password"
                            children={(f) => (
                                <div className="flex flex-col gap-2" key={f.name}>
                                    <label className="font-medium text-[12px]" htmlFor={f.name}>
                                        ПАРОЛЬ
                                    </label>
                                    <input 
                                    type="password"
                                    placeholder="Введите пароль"
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    onBlur={f.handleBlur}
                                    className="bg-[#2F2F2F] text-white text-[12px] p-2 focus:outline-white rounded-lg outline-transparent outline-px"
                                    />
                                </div>
                            )}
                            />
                        </div>
                        <button type="submit" className="p-3 w-full bg-[#006EFF] rounded-3xl cursor-pointer">Войти</button>
                    </form>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-[12px] font-medium">Нет аккаунта?</p>
                        <Link href="/signup" className="text-[#006EFF] text-[12px] font-semibold">Зарегистрироваться</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}