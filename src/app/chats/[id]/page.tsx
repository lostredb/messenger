
import { use } from "react";
import ChatWindow from "../../ChatWindow";

export default function CharPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    return (
        <ChatWindow id={id}/>
    )
}