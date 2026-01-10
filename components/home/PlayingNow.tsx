"use client"
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { BlurFade } from "../ui/blur-fade";

const PlayingNow = () => {
  const fullRoomData = useQuery(api.room.getRoomFullData);
  console.log(fullRoomData)
if (fullRoomData === undefined) {
  return (
    <div className="mb-2">
      <p className="uppercase text-gray-600 text-sm mb-2">playing now</p>

      <div className="flex flex-col items-stretch gap-1">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="w-full rounded-2xl p-4"
          >
            <div className="flex w-full items-center justify-between gap-4">
              {/* room icon */}
              <Skeleton className="h-12 w-12 rounded-lg" />

              {/* song + location */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-50" />
                <Skeleton className="h-3 w-35" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function countryCodeToEmoji(code: string | undefined) {
  if (!code) return "🏳️"; // fallback
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}


  return (
    <div className="w-full">
      {fullRoomData.length > 0 &&(
      <p className="uppercase text-gray-600 text-sm">playing now</p>
      )}
    {fullRoomData.length === 0 && (
      <Card className="flex flex-col items-center justify-center my-8 rounded-2xl bg-neutral-900/30 p-6 text-center">
        <p className="text-sm font-medium text-neutral-300">
          No rooms playing right now
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Create a room or join one to start listening
        </p>
      </Card>
    )}
     <div className="flex flex-col items-stretch my-4">
        {fullRoomData.map((room,idx) => {
          return (
            <BlurFade key={room.room._id} delay={0.25 + idx * 0.40} >
            <Link
              href={`/room/${room.room.roomCode}`}
              className="block w-full hover:bg-neutral-900/30 rounded-2xl"
            >
              <div className="flex w-full items-center justify-between gap-4 p-4 rounded-lg">
                <div className="h-12 w-12 bg-neutral-400/20 rounded-lg justify-center items-center flex text-4xl">
                   {countryCodeToEmoji(room.participants[0].country)}
                   
                </div>

                <div className="flex-1">
                  <p className="text-md font-semibold">
                    {room.room.currentSong ?? "No song playing"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {room.room.roomCode} {room.participants[0].city+" "+room.participants[0].region+" "+room.participants[0].country}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-[0.6rem]">
                    {room.participants.map((participant) => (
                      <Avatar key={participant._id}>
                        {/* render country flags */}
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {countryCodeToEmoji(participant.country)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <ChevronRight
                    className="text-neutral-400"
                    strokeWidth={1}
                    size={20}
                  />
              </div>

              </div>
            </Link>
            </BlurFade>
            
          );
        })}
      </div>

    </div>
  );
};

export default PlayingNow;
