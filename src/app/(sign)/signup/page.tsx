'use client'

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { authClient } from "../../authClient"
import Link from "next/link"
import { api } from "@/server/lib/api"
import { files } from "@/server/db/schema"


export default function SignUpPage() {
        const rt = useRouter()
    
        const {isPending} = authClient.useSession()
        
        const form = useForm({
            defaultValues: {
                name: '',
                email: '',
                password: '',
                userImg: null as File | null
            },
            onSubmit: async ({value, formApi}) => {
                const {name, email, password, userImg} = value;

                formApi.reset()

                await authClient.signUp.email(
                    {name, email, password},
                    {
                        onSuccess: async ({data}) => {
                            const userId = data.user.id
                            const fileId = `avatars-${userId}-${Date.now()}.webp`

                            if (userImg) {
                                api.files.avatar.put({fileId, userImg, userId})
                            }

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
                        <Link href="/"><p className="text-transparent text-[40px] font-black bg-clip-text bg-linear-to-br from-[#D9D9D9] to-[#737373]">RUGRAM</p></Link>
                        <p className="text-[#A8A8A8] text-2xl font-bold">РЕГИСТРАЦИЯ</p>
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
                                name="name"
                                children={(f) => (
                                    <div className="flex flex-col gap-2" key={f.name}>
                                        <label className="font-medium text-[12px]" htmlFor={f.name}>
                                            ИМЯ
                                        </label>
                                        <input 
                                        type="text"
                                        placeholder="Введите имя"
                                        value={f.state.value}
                                        onChange={(e) => f.handleChange(e.target.value)}
                                        onBlur={f.handleBlur} 
                                        className="bg-[#2F2F2F] text-white text-[12px] p-2 focus:outline-white rounded-lg outline-transparent outline-px"
                                        />
                                    </div>
                                )}
                                />
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
                                <Field 
                                name="userImg"
                                children={(f) => (
                                    <div className="flex flex-col gap-2" key={f.name}>
                                        <label className="font-medium text-[12px]" htmlFor={f.name}>
                                            АВАТАРКА
                                        </label>
                                        <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => f.handleChange(e.target.files?.[0] ?? null)}
                                        className="bg-[#2F2F2F] text-white text-[12px] p-2 focus:outline-white rounded-lg outline-transparent outline-px"
                                        />
                                    </div>
                                )}
                                />
                            </div>
                            <button type="submit" className="p-3 w-full bg-[#006EFF] rounded-3xl cursor-pointer">Зарегистрироваться</button>
                        </form>
                        <div className="flex flex-col gap-1 items-center">
                            <p className="text-[12px] font-medium">Есть аккаунт?</p>
                            <Link href="/signin" className="text-[#006EFF] text-[12px] font-semibold">Войти</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
}