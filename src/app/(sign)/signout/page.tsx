'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../../authClient";


export default function SignOutPage() {
    const rt = useRouter()

    useEffect(() => {
        authClient.signOut().then(() => {
            rt.push('/')
        })
    })
}