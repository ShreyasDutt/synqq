import { Card, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"

const ChatTab = () => {
  return (
    <div className="px-2 py-3">
        <Card className="h-145">
            <div className="flex items-center justify-center h-full flex-col gap-3 text-neutral-400">
                <MessageCircle size={50}/>
                <div className="flex flex-col items-center justify-center">
                <p>No messages yet</p>
                <p className="text-xs">Start the conversation</p>
                </div>

            </div>

        <CardFooter>
        <Textarea
            className="h-10 min-h-0 p-2 text-sm resize-none"
            placeholder="Type a message..."
        />
        </CardFooter>

        </Card>
    </div>
  )
}

export default ChatTab