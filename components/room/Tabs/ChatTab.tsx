"use client";
import React from "react";
import { sendMessageAction } from "@/app/actions/message.actions";
import { displayNameAtom, roomCodeAtom } from "@/atoms/atoms";
import { Card, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { MessageCircle, Send } from "lucide-react";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatTab = () => {
  const [displayName] = useAtom(displayNameAtom);
  const [roomCode] = useAtom(roomCodeAtom);

  if (!roomCode) {
    console.error("Unable to find roomCode!!");
    return null;
  }
  const chatData = useQuery(api.message.getMessages, { roomCode });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        // submits the form (works with server actions)
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="h-full w-full flex justify-center px-2 py-2 sm:px-4 sm:py-4 lg:px-0">
      <Card className="flex-1 max-w-2xl w-full mx-auto flex flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {chatData?.messages?.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-neutral-400 px-4">
              <MessageCircle size={50} />
              <div className="flex flex-col items-center justify-center text-center">
                <p>No messages yet</p>
                <p className="text-xs">Start the conversation</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full px-2 sm:px-3 py-3">
                <div className="flex flex-col gap-3">
                  {chatData?.messages?.map((message) => {
                    const isMe = message.sendBy === displayName;

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-2 sm:p-3 flex flex-col gap-1 rounded-lg max-w-[80%] sm:max-w-[70%] break-words ${
                            isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-foreground/70 text-black"
                          }`}
                        >
                          <p className="text-[10px] sm:text-xs opacity-70">
                            {isMe ? "You" : message.sendBy}
                          </p>

                          <p className="text-sm sm:text-[15px]">
                            {message.content}
                          </p>

                          <p className="text-[9px] sm:text-[10px] opacity-60 text-right">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Input area */}
        <CardFooter>
          <form
            action={sendMessageAction.bind(null, { displayName, roomCode })}
            className="flex justify-center items-center gap-3 w-full"
          >
            <Textarea
              className="h-10 min-h-0 p-2 text-sm resize-none flex-1"
              placeholder="Type a message..."
              name="message"
              onKeyDown={handleKeyDown}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatTab;
