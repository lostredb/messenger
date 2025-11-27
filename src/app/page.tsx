'use client'

import { api } from "@/server/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader } from "./loader"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { IoIosNotifications } from "react-icons/io"
import { AiFillSetting } from "react-icons/ai"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { queryClient } from "./queryClient"

export default function Home() {
  const {data: me, isLoading} = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const {data, error} = await api.users.me.get()
      if (error) throw new Error(String(error.status))
      return data
    }
  })

  console.log(me)
  
  useEffect(() => {
    if (!me && !isLoading) {
      rt.push('/signin')
    }
  }, [me, isLoading])
  
  const rt = useRouter()

  if (isLoading) {
    return <Loader />
  }
  if (me) {
    return (
      <div className="w-full h-full flex bg-[#2B2B2B]">
        <div className="h-full bg-[#252525] flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-transparent text-[40px] font-black bg-clip-text bg-linear-to-br from-[#D9D9D9] to-[#737373]">RUGRAM</p>
            <div className="flex justify-between gap-3 p-2 bg-[#383838] rounded-2xl shadow-lg items-center w-full">
              <div className="flex gap-3">
                <Image 
                src={me.user.image  ? `/api/files/${me.user.image}` : '/not.png'}
                alt=""
                width={256}
                height={256}
                className="rounded-full size-9 object-cover"
                />
                <div className="flex flex-col text-[12px]">
                  <p className="font-semibold text-[#A8A8A8]">{me.user.name}</p>
                  <p className="text-[#717171]">{me.user.email}</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                {/* <IoIosNotifications className="size-4 text-white"/> */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <AiFillSetting className="size-[14px] text-white cursor-pointer"/>
                  </DropdownMenuTrigger>  
                  <DropdownMenuContent className="bg-[#202020] text-white" align="start">
                    <DropdownMenuLabel className="text-[12px]">
                      Действия с аккаунтом
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="text-[12px] text-[#A8A8A8]" onClick={() => rt.push('/signin')}>
                      Сменить аккаунт
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="text-[12px]" onClick={() => rt.push('/signout')}>
                      <p className="text-red-500">Выйти</p>
                      <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <PeopleSearch />
          <GetChats />
        </div>
      </div>
    )
  }
}

function PeopleSearch() {
  const [search, setSearch] = useState<string>('')
  const {data: users} = useQuery({
    queryKey: ["users", search],
    queryFn: async ({ queryKey }) => {
      const [_key, searchParam] = queryKey
      const { data, error } = await api.users({ search: searchParam }).get()

      if (error) throw new Error(String(error.status))
      return data
    },
    enabled: !!search
  })

  const createChatMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.messages.chats({id}).post()
      if (error) throw new Error(String(error.status))
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['chats']})
    }
  })
  
  return (
    <div className="w-full flex flex-col gap-3">
      <input 
      type="text" 
      placeholder="Поиск"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full text-[12px] outline-1 outline-[#4D4D4D] py-1 px-2 bg-[#383838] rounded-[8px]"/>
      {users && (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} onClick={() => createChatMutation.mutateAsync(u.id)} className=" cursor-pointer flex gap-3 items-center bg-[#383838] p-2 rounded-2xl shadow-lg hover:shadow-sm hover:shadow-white transition-all duration-200 ease-in-out">
              <Image 
              src={u.image ? `/api/files/${u.image}` : '/not.png'}
              alt=""
              width={256}
              height={256}
              className="rounded-full size-9 object-cover"
              />
              <div className="flex flex-col text-[12px]">
                <p className="font-semibold text-[#A8A8A8]">{u.name}</p>
                <p className="text-[#717171]">{u.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GetChats() {
  const [activeChat, setActiveChat] = useState<string>('')

  const {data: chats} = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const {data, error} = await api.messages.chats.get()
      if (error) throw new Error(String(error.status))
      return data
    }
  })

  return (
    <div className="flex flex-col gap-2 w-full">
      {chats?.map((c) => (
        <div onClick={() => setActiveChat(c.chatId)} key={c.chatId} className={`flex gap-3 cursor-pointer items-center bg-[#383838] p-2 rounded-2xl shadow-lg ${activeChat === c.chatId ? 'bg-[#006EFF]' : ''}`}>
          <Image 
          src={c.interlocutor.image ? `/api/files/${c.interlocutor.image}` : '/not.png'}
          alt=""
          width={256}
          height={256}
          className="rounded-full size-9 object-cover"
          />
          <div className="flex flex-col text-[12px]">
            <p className="font-semibold text-[#A8A8A8]">{c.interlocutor.name}</p>
            <p className="text-[#717171]">{c.lastMes ? c.lastMes : 'Здесь пока нет сообщений'}</p>
          </div>
        </div>
      ))}
    </div>
  )
}