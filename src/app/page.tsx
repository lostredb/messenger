'use client'

import { api } from "@/server/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "./loader"
import { useEffect} from "react"
import { useRouter } from "next/navigation"
import { NavigationBar } from "./navigationBar"

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

  return (
    <NavigationBar active=""/>
  )
}
