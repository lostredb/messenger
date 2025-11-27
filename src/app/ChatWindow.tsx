'use client'

import { api } from "@/server/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { NavigationBar } from "./navigationBar"
import { queryClient } from "./queryClient"
import { useForm } from "@tanstack/react-form"
import {IoSend} from 'react-icons/io5'

export default function ChatWindow({id}: {id: string}) {
    const {data: me} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const {data, error} = await api.users.me.get()
            if (error) throw new Error(String(error.status))
            return data
        }
    })

    const {data: messages} = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const {data, error} = await api.messages({id: id}).get()
            if (error) throw new Error(String(error.status))
            return data
        }
    })

    return (
        <div className="flex h-full w-full bg-[#2B2B2B]">
            <NavigationBar active={id}/>
            <div className="flex flex-col w-full h-full p-4 bg-transparent">
                <div className="h-full w-full flex flex-col gap-3 overflow-y-auto">
                    {messages?.map((m) => (
                        <div key={m.id} className={`flex w-full ${m.userId === me?.user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 font-semibold rounded-sm text-white ${m.userId === me?.user.id ? 'bg-[#006FFF]' : 'bg-[#505050]'}`}>
                                <p className="whitespace-pre-line">{m.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <SendMessage id={id}/>
            </div>
        </div>
    )
}

function SendMessage({id}: {id: string}) {
    const sendMessageMutation = useMutation({
        mutationFn: async (message: string) => {
            const {error} = await api.messages({id}).post(message)
            if (error) throw new Error(String(error.status))
            form.reset()
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ['messages']})
        }
    })

    const form = useForm({
        defaultValues: {
            message: ''
        },
        onSubmit: async ({value}) => {
            await sendMessageMutation.mutateAsync(value.message)
        }
    })
    
    const Field = form.Field

    return (
        <form
        onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }}
        className="w-full flex gap-4 items-center"
        >
            <Field 
            name="message"
            children={(f) => (
                <textarea
                key={f.name}
                placeholder="Введите текст"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur} 
                className="bg-[#383838] p-3 rounded-sm font-semibold outline-0 w-full resize-none"
                />
            )}
            />
            <button type="submit" className="p-3 rounded-full bg-[#006EFF] flex items-center justify-center h-fit">
                <IoSend className="size-4 text-white"/>
            </button>
        </form>
    )
}