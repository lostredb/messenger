'use client'

import { api } from "@/server/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "./loader"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const {data: me, isLoading} = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const {data, error} = await api.users.me.get()
      if (error) throw new Error(String(error.status))
      return data
    }
  })
  
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
    <div className="w-full h-full flex">
      <div className="h-full w-full max-w-[]">
        
      </div>
    </div>
  )
}