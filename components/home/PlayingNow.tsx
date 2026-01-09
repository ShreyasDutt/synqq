"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card } from "../ui/card";
import Link from "next/link";

const PlayingNow = () => {
  const rooms = useQuery(api.room.getRooms)
  if (rooms === undefined) {
    return (
      <main>Loading...</main>
    )
  }
  return (
    <div>
      <p className="uppercase text-gray-600 text-sm">playing now</p>

      <div className="flex flex-col items-center justify-center gap-6 my-4">
        {rooms.map((room) => (
          <Link key={room._id} href={`/room/${room.roomCode}`}>
            <Card className="p-5">{room.roomCode}</Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlayingNow;
