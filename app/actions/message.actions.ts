"use server"

import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"

type sendMessage = {
    displayName: string,
    message: string,
    roomCode: number
}
const sendMessageAction = async ({displayName, message, roomCode}: sendMessage) => {
    const data = fetchMutation(api.message.sendMessage, {
        displayName,
        message,
        roomCode
    })
}