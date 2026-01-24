"use client";
import { roomCodeAtom } from "@/atoms/atoms";
import { amIAdminAtom, CurrentPlayingSong, roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";

const MusicTab = () => {
  const [amIAdmin] = useAtom(amIAdminAtom);
  const [roomData] = useAtom(roomDataAtom);
  const [roomCode] = useAtom(roomCodeAtom);
  const [, setCurrentPlayingSong] = useAtom(CurrentPlayingSong);
  const [currentSongId, setcurrentSongId] = useState<Id<"song"> | null>(null);
  const [currentSongDuration, setcurrentSongDuration] = useState('');

  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }

  const songsList = useQuery(api.song.getSongs, { roomCode });
  const deleteSongMutation = useMutation(api.song.deleteSong);
  const setRoomPlayingSong = useMutation(api.song.setRoomSongUrl);
  
  const SongUrl = useQuery(api.song.getSongUrl, currentSongId ?  { songId: currentSongId }: 'skip');

  useEffect(() => {
    if(SongUrl){
      setCurrentPlayingSong({
        SongUrl: SongUrl,
        Duration: currentSongDuration,
      });
      setRoomPlayingSong({ roomCode, songUrl: SongUrl });
    }
  }, [SongUrl])
  
  return (
    <>
      <div className="mt-10 space-y-2">
        {songsList?.length === 0 &&
          ((amIAdmin || roomData?.room.playbackPermissions === "everyone") ? (
          
          <div className="flex flex-col gap-3 items-center justify-center">
            <p className="text-neutral-400">No tracks yet</p>
            <Button className="rounded-full text-xs px-4 py-2">
              Load default tracks
            </Button>
          </div>
        ) : (
            <div className="flex flex-col gap-3 items-center justify-center">
            <p className="text-neutral-400">No tracks available</p>
            
          </div>
        ))}

        {songsList?.map((song, index) => {
          const minutes = Math.floor(song.duration / 60);
          const seconds = Math.floor(song.duration % 60)
            .toString()
            .padStart(2, "0");

          const formattedDuration = `${minutes}:${seconds}`;
          return (
            <div
              key={song._id}
              className="flex items-center px-4 py-3 rounded-md group transition-colors select-none  text-neutral-300 hover:bg-neutral-900 cursor-pointer"
            >

              <div className="flex items-center flex-1" onClick={()=>{setcurrentSongId(song._id); setcurrentSongDuration(formattedDuration)}}>
              <p className="w-6 text-sm text-neutral-500">{index + 1}</p>

              <div className="flex-1 ml-4">
                <p className="text-sm">{song.title}</p>
              </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <p className="text-neutral-400">{formattedDuration}</p>
                {(amIAdmin ||
                  roomData?.room.playbackPermissions === "everyone") && (
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MusicTab;
