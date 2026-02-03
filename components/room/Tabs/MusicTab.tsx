"use client";
import { getdefaultSongsAction } from "@/app/actions/defaultSongs.action";
import { roomCodeAtom } from "@/atoms/atoms";
import {
  amIAdminAtom,
  CurrentPlayingSong,
  roomDataAtom,
} from "@/atoms/convexQueriesAtoms";
import { playNextSongAtom, playPreviousSongAtom, uploadingAudioAtom } from "@/atoms/song";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { AudioLines, Minus, Play, Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

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
  const myPlayPermission =
    amIAdmin || roomData?.room.playbackPermissions === "everyone";
  const [, setCurrentPlayingSong] = useAtom(CurrentPlayingSong);
  const [uploadingAudio] = useAtom(uploadingAudioAtom);
  const [playNextSong, setPlayNextSong] = useAtom(playNextSongAtom);
  const [playPreviousSong, setPlayPreviousSong] = useAtom(playPreviousSongAtom);
  
  const [currentSongId, setcurrentSongId] = useState<Id<"song"> | null>(null);
  const [defaultCurrentSongUrl, setDefaultCurrentSongUrl] = useState<
    string | null
  >(null);
  const [defaultCurrentSongId, setDefaultCurrentSongId] = useState<
    string | null
  >(null);
  const [currentSongUpdate, setCurrentSongUpdate] = useState<boolean>(false);
  const [defaultCurrentSongUpdate, setDefaultCurrentSongUpdate] =
    useState<boolean>(false);
  const [currentSongDuration, setcurrentSongDuration] = useState<string>("");
  const [defaultSongs, setDefaultSongs] = useState<Song[]>([]);

  const songsList = useQuery(api.song.getSongs, { roomCode });
  console.log("song;list: ", songsList);

  const SongUrl = useQuery(
    api.song.getSongUrl,
    currentSongId ? { songId: currentSongId } : "skip",
  );

  const deleteSongMutation = useMutation(api.song.deleteSong);
  const setRoomPlayingSong = useMutation(api.song.setRoomSongUrl);
  const openDefaultTracksMutation = useMutation(api.song.openDefaultTracks);

  const playNextSongFunction = () => {
    const currentPlayingSong = roomData?.room.currentSong;
    if (!currentPlayingSong) return;

    const currentSongIndex = songsList?.findIndex(song => song._id === currentPlayingSong);
    console.log({ currentSongIndex });

  }

  useEffect(() => {
    if (currentSongUpdate) {
      if (!SongUrl || !currentSongId) return console.log("error songgg");
      setCurrentPlayingSong({
        SongUrl,
        Duration: currentSongDuration,
      });
      setRoomPlayingSong({ roomCode, songUrl: SongUrl, songId: currentSongId });

      setCurrentSongUpdate(false);
    }
  }, [currentSongUpdate, SongUrl, currentSongId]);

  useEffect(() => {
    if (defaultCurrentSongUpdate) {
      if (!defaultCurrentSongUrl || !defaultCurrentSongId)
        return console.log("error default songgg");

      setCurrentPlayingSong({
        SongUrl: defaultCurrentSongUrl,
        Duration: currentSongDuration,
      });
      setRoomPlayingSong({
        roomCode,
        songUrl: defaultCurrentSongUrl,
        songId: defaultCurrentSongId,
      });

      setDefaultCurrentSongUpdate(false);
    }
  }, [defaultCurrentSongUpdate, defaultCurrentSongId, defaultCurrentSongUrl]);

  const [defaultSongsPending, startTransition] = useTransition();
  useEffect(() => {
    if (!roomData?.room.defaultTracks || defaultSongs.length !== 0) return;

    startTransition(async () => {
      const data = await getdefaultSongsAction();
      setDefaultSongs(data);
    });
  }, [roomData?.room.defaultTracks]);

  return (
    <>
      <div className="mt-10 space-y-2">
        {/* Default Songs */}
        {roomData?.room.defaultTracks && (
          <div>
            {/* Default Songs Section Header */}
            <div className="flex items-center justify-between px-4 py-2 mb-2 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Default Tracks
                </span>
                <span className="text-xs text-muted-foreground/60">
                  ({defaultSongs.length})
                </span>
              </div>
              {myPlayPermission && (
                <button
                  onClick={() =>
                    openDefaultTracksMutation({
                      roomCode,
                      setDefaultTracks: false,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Remove all default tracks"
                >
                  <Trash size={14} />
                  <span>Remove All</span>
                </button>
              )}
            </div>
            {defaultSongsPending ? (
              <p className="flex justify-center items-center pt-7 text-muted-foreground px-4">
                Loading default songs...
              </p>
            ) : (
              defaultSongs.map((song, index) => (
                <div
                  key={`default-${index}`}
                  className={`flex items-center px-4 py-3 rounded-md group transition-colors select-none cursor-pointer ${
                    myPlayPermission && "hover:bg-muted-foreground/10"
                  }`}
                >
                  <div
                    className={`flex items-center flex-1 ${
                      `default-${song?.name}` === roomData?.room.currentSong &&
                      "text-primary"
                    }`}
                    onClick={() => {
                      if (!song || !myPlayPermission) return;
                      setDefaultCurrentSongId(`default-${song.name}`);
                      setDefaultCurrentSongUrl(song.url);
                      setcurrentSongDuration(song?.duration);
                      setDefaultCurrentSongUpdate(true);
                    }}
                  >
                    {`default-${song?.name}` === roomData?.room.currentSong && roomData.room.currentSongState? (
                      <>
                        <AudioLines className="text-primary w-6 h-6 animate-pulse" />
                      </>
                    ) : (
                      <>
                        {myPlayPermission ? (
                          <div className="w-6 flex items-center justify-center relative">
                            <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                              {index + 1}
                            </span>
                            <Play
                              size={16}
                              className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                            {index + 1}
                          </span>
                        )}
                      </>
                    )}

                    <div className="flex-1 ml-4">
                      <p className="text-sm">{song?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <p className="text-neutral-400">{song?.duration}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* User Songs */}
        {songsList?.map((song, index) => {
          const minutes = Math.floor(song.duration / 60);
          const seconds = Math.floor(song.duration % 60)
            .toString()
            .padStart(2, "0");

          const formattedDuration = `${minutes}:${seconds}`;

          const displayIndex = roomData?.room.defaultTracks
            ? defaultSongs.length + index + 1
            : index + 1;

          return (
            <div
              key={song._id}
              className={`flex items-center px-4 py-3 rounded-md group transition-colors select-none cursor-pointer ${
                myPlayPermission && "hover:bg-muted-foreground/10"
              }`}
            >
              <div
                className={`flex items-center flex-1 ${
                  song._id === roomData?.room.currentSong && "text-primary"
                }`}
                onClick={() => {
                  if (myPlayPermission) {
                    setcurrentSongId(song._id);
                    setcurrentSongDuration(formattedDuration);
                    setCurrentSongUpdate(true);
                  }
                }}
              >
                {song._id === roomData?.room.currentSong && roomData.room.currentSongState? (
                  <>
                    <AudioLines className="text-primary w-6 h-6 animate-pulse" />
                  </>
                ) : (
                  <>
                    {myPlayPermission ? (
                      <div className="w-6 flex items-center justify-center relative">
                        <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                          {displayIndex}
                        </span>
                        <Play
                          size={16}
                          className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-500 group-hover:opacity-0 transition-opacity">
                        {displayIndex}
                      </span>
                    )}
                  </>
                )}

                <div className="flex-1 ml-4">
                  <p className="text-sm">{song.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <p className="text-neutral-400">{formattedDuration}</p>
                {/* Individual delete button for user songs */}
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

        {uploadingAudio && (
          <p className="flex justify-center items-center text-muted-foreground pb-2">
            Uploading songs...
          </p>
        )}

        {/* Load default tracks button */}
        {!roomData?.room.defaultTracks && myPlayPermission && (
          <div className="flex flex-col gap-3 items-center justify-center pb-4">
            {songsList?.length === 0 && !uploadingAudio && (
              <p className="text-neutral-400">No tracks yet</p>
            )}

            <Button
              className="rounded-full text-xs px-4 py-2"
              onClick={() => {
                openDefaultTracksMutation({
                  roomCode,
                  setDefaultTracks: true,
                });
              }}
            >
              Load default tracks
            </Button>
          </div>
        )}

        {/* Empty state */}
        {songsList?.length === 0 &&
          !uploadingAudio &&
          !myPlayPermission &&
          !roomData?.room.defaultTracks && (
            <div className="flex flex-col gap-3 items-center justify-center">
              <p className="text-neutral-400">No tracks available</p>
            </div>
          )}
      </div>
    </>
  );
};

export default MusicTab;
