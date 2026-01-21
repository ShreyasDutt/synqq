"use client";
import { roomCodeAtom } from "@/atoms/atoms";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Minus } from "lucide-react";

const MusicTab = () => {
  const [roomCode] = useAtom(roomCodeAtom);
    if (!roomCode) {
      console.error("Room Code not found!!");
      return null;
    }
  const songsList = useQuery(api.song.getSongs, { roomCode });
  const deleteSongMutation = useMutation(api.song.deleteSong);
  return (
    <>
      <div className="mt-10 space-y-2">
        {songsList?.length === 0 && (
          <div className="flex flex-col gap-3 items-center justify-center">
            <p className="text-neutral-400">No tracks yet</p>
            <Button className="rounded-full text-xs px-4 py-2">
              Load default tracks
            </Button>
          </div>
        )}

        {songsList?.map((song, index) => {
          const minutes = Math.floor(song.duration / 60);
          const seconds = Math.floor(song.duration % 60)
            .toString()
            .padStart(2, "0");

          const formattedDuration = `${minutes}:${seconds}`;
          return (
            <div
              key={song._id}
              className="flex items-center px-4 py-3 rounded-md group transition-colors select-none text-neutral-300 hover:bg-neutral-800 cursor-pointer"
            >
              <p className="w-6 text-sm text-neutral-500">{index + 1}</p>

              <div className="flex-1 ml-4">
                <p className="text-sm">{song.title}</p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <p className="text-neutral-400">{formattedDuration}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:text-red-500"
                  onClick={async () =>
                    await deleteSongMutation({ songId: song._id })
                  }
                >
                  <Minus size={18} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
    </>
  );
};

export default MusicTab;
