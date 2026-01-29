"use client";
import { getdefaultSongsAction } from "@/app/actions/defaultSongs.action";
import { roomCodeAtom } from "@/atoms/atoms";
import { amIAdminAtom, CurrentPlayingSong, roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Minus, Play, Trash } from "lucide-react";

import { useEffect, useState } from "react";

type Song = {
  name: string;
  duration: string;
  url: string;
};

const MusicTab = () => {
  const [roomCode] = useAtom(roomCodeAtom);
  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }
  const [roomData] = useAtom(roomDataAtom);
  const [amIAdmin] = useAtom(amIAdminAtom);
  const myPlayPermission = amIAdmin || roomData?.room.playbackPermissions === "everyone";
  const [, setCurrentPlayingSong] = useAtom(CurrentPlayingSong);
  const [currentSongId, setcurrentSongId] = useState<Id<"song"> | null>(null);
  const [currentSongDuration, setcurrentSongDuration] = useState("");
  const [defaultSongs, setDefaultSongs] = useState<(void | Song | null)[]>([]);

  const songsList = useQuery(api.song.getSongs, { roomCode });
  const SongUrl = useQuery(
    api.song.getSongUrl,
    currentSongId ? { songId: currentSongId } : "skip",
  );

  const deleteSongMutation = useMutation(api.song.deleteSong);
  const setRoomPlayingSong = useMutation(api.song.setRoomSongUrl);
  const openDefaultTracksMutation = useMutation(api.song.openDefaultTracks);

  useEffect(() => {
    if (SongUrl) {
      setCurrentPlayingSong({
        SongUrl: SongUrl,
        Duration: currentSongDuration,
      });
      setRoomPlayingSong({ roomCode, songUrl: SongUrl });
    }
  }, [SongUrl]);

  useEffect(() => {}, []);

  return (
    <>
      <div className="mt-10 space-y-2">
        {songsList?.length === 0 &&
          !roomData?.room.defaultTracks &&
          (myPlayPermission ? (
            <div className="flex flex-col gap-3 items-center justify-center">
              <p className="text-neutral-400">No tracks yet</p>
              <Button
                className="rounded-full text-xs px-4 py-2"
                onClick={async () => {
                  const songs = await getdefaultSongsAction();
                  setDefaultSongs(songs);
                  openDefaultTracksMutation({
                    roomCode,
                    setDefaultTracks: true,
                  });
                }}
              >
                Load default tracks
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center">
              <p className="text-neutral-400">No tracks available</p>
            </div>
          ))}

        {roomData?.room.defaultTracks && (
          <div>
            <div className="text-2xl flex justify-center gap-4 px-4">
              <div>Default Songs</div>
              {myPlayPermission && (
                <div>
                  <button
                    onClick={() =>
                      openDefaultTracksMutation({
                        roomCode,
                        setDefaultTracks: false,
                      })
                    }
                    className="text-foreground hover:text-destructive hover:cursor-pointer"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </div>
            <div>
              {defaultSongs.map((song, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-3 rounded-md group transition-colors select-none cursor-pointer ${
                    myPlayPermission && "hover:bg-muted-foreground/10"
                  }`}
                >
                  <div
                    className="flex items-center flex-1"
                    // onClick={() => {
                    //   if (
                    //     myPlayPermission
                    //   ) {
                    //     setcurrentSongId(song._id);
                    //     setcurrentSongDuration(formattedDuration);
                    //   }
                    // }}
                  >
                    {myPlayPermission ? (
                      <div className="w-6 flex items-center justify-center relative">
                        {/* Index number */}
                        <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                          {index + 1}
                        </span>

                        {/* Play icon (hidden until hover) */}
                        <Play
                          size={16}
                          className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        />
                      </div>
                    ) : (
                      <p className="w-6 text-sm text-neutral-500">
                        {index + 1}
                      </p>
                    )}

                    <div className="flex-1 ml-4">
                      <p className="text-sm">{song?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <p className="text-neutral-400">{song?.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {songsList?.length != 0 && (
          <div className="text-2xl flex justify-center px-4">My Songs</div>
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
              className={`flex items-center px-4 py-3 rounded-md group transition-colors select-none cursor-pointer ${
                myPlayPermission && "hover:bg-muted-foreground/10"
              }`}
            >
              <div
                className="flex items-center flex-1"
                onClick={() => {
                  if (myPlayPermission) {
                    setcurrentSongId(song._id);
                    setcurrentSongDuration(formattedDuration);
                  }
                }}
              >
                {myPlayPermission ? (
                  <div className="w-6 flex items-center justify-center relative">
                    {/* Index number */}
                    <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                      {index + 1}
                    </span>

                    {/* Play icon (hidden until hover) */}
                    <Play
                      size={16}
                      className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    />
                  </div>
                ) : (
                  <p className="w-6 text-sm text-neutral-500">{index + 1}</p>
                )}

                <div className="flex-1 ml-4">
                  <p className="text-sm">{song.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <p className="text-neutral-400">{formattedDuration}</p>
                {myPlayPermission && (
                  <button
                    className="text-foreground hover:text-destructive hover:cursor-pointer"
                    onClick={async () =>
                      await deleteSongMutation({ songId: song._id })
                    }
                  >
                    <Minus size={18} />
                  </button>
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
