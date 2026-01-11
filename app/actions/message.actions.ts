"use server"

import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"

type SendMessage = {
    displayName: string,
    roomCode: number
}
export const sendMessageAction = async ({ displayName, roomCode}: SendMessage, formData: FormData) => {
    const message = formData.get('message')?.toString();
    if (!message) return console.error("No message recieved in the sendMessageAction");
    await fetchMutation(api.message.sendMessage, {
        displayName,
        message,
        roomCode
    })
}