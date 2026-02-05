"use client";
import { getdefaultSongsAction } from "@/app/actions/defaultSongs.action";
import { roomCodeAtom } from "@/atoms/atoms";
import {
  amIAdminAtom,
  CurrentPlayingSong,
  roomDataAtom,
} from "@/atoms/convexQueriesAtoms";
import {
  playNextSongAtom,
  playPreviousSongAtom,
  songEndsAtom,
  uploadingAudioAtom,
} from "@/atoms/song";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import formatTime from "@/lib/formatSongTime";
import { useMutation, useQuery } from "convex/react";
import { useAtom, useSetAtom } from "jotai";
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
  const setCurrentPlayingSong = useSetAtom(CurrentPlayingSong);
  const [uploadingAudio] = useAtom(uploadingAudioAtom);
  const [playNextSong, setPlayNextSong] = useAtom(playNextSongAtom);
  const [playPreviousSong, setPlayPreviousSong] = useAtom(playPreviousSongAtom);
  const [songEnds, setSongEnds] = useAtom(songEndsAtom);
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

  const SongUrl = useQuery(
    api.song.getSongUrl,
    currentSongId ? { songId: currentSongId } : "skip",
  );

  const deleteSongMutation = useMutation(api.song.deleteSong);
  const setRoomPlayingSong = useMutation(api.song.setRoomSongUrl);
  const openDefaultTracksMutation = useMutation(api.song.openDefaultTracks);

const playNextSongFunction = () => {
  const currentPlayingSong = roomData?.room.currentSong;
  if (!currentPlayingSong || !songsList) return;

  // 🚨 Default tracks enabled but not loaded yet
  if (roomData.room.defaultTracks && defaultSongs.length === 0) return;

  let currentSongIndex = songsList.findIndex(
    (song) => song._id === currentPlayingSong,
  );

  // ================= DEFAULT TRACKS =================
  if (currentSongIndex === -1 && roomData.room.defaultTracks) {
    const defaultIndex = defaultSongs.findIndex(
      (song) => `default-${song.name}` === currentPlayingSong,
    );

    if (defaultIndex === -1) return;

    // --- Last default song ---
    if (defaultIndex === defaultSongs.length - 1) {
      if (songsList.length > 0) {
        const firstUserSong = songsList[0];
        if (!firstUserSong) return;

        setcurrentSongId(firstUserSong._id);
        setcurrentSongDuration(formatTime(firstUserSong.duration));
        setCurrentSongUpdate(true);
        return;
      }

      const firstDefault = defaultSongs[0];
      if (!firstDefault) return;

      setDefaultCurrentSongId(`default-${firstDefault.name}`);
      setDefaultCurrentSongUrl(firstDefault.url);
      setcurrentSongDuration(firstDefault.duration);
      setDefaultCurrentSongUpdate(true);
      return;
    }

    // --- Next default song ---
    const nextDefault = defaultSongs[defaultIndex + 1];
    if (!nextDefault) return;

    setDefaultCurrentSongId(`default-${nextDefault.name}`);
    setDefaultCurrentSongUrl(nextDefault.url);
    setcurrentSongDuration(nextDefault.duration);
    setDefaultCurrentSongUpdate(true);
    return;
  }

  // ================= USER SONGS =================
  if (currentSongIndex === -1) return;

  if (currentSongIndex === songsList.length - 1) {
    if (roomData.room.defaultTracks && defaultSongs.length > 0) {
      const firstDefault = defaultSongs[0];
      if (!firstDefault) return;

      setDefaultCurrentSongId(`default-${firstDefault.name}`);
      setDefaultCurrentSongUrl(firstDefault.url);
      setcurrentSongDuration(firstDefault.duration);
      setDefaultCurrentSongUpdate(true);
      return;
    }

    const firstUserSong = songsList[0];
    if (!firstUserSong) return;

    setcurrentSongId(firstUserSong._id);
    setcurrentSongDuration(formatTime(firstUserSong.duration));
  } else {
    const nextUserSong = songsList[currentSongIndex + 1];
    if (!nextUserSong) return;

    setcurrentSongId(nextUserSong._id);
    setcurrentSongDuration(formatTime(nextUserSong.duration));
  }

  setCurrentSongUpdate(true);
};

const playPreviousSongFunction = () => {
  const currentPlayingSong = roomData?.room.currentSong;
  if (!currentPlayingSong || !songsList) return;

  // 🚨 Default tracks enabled but not loaded yet
  if (roomData.room.defaultTracks && defaultSongs.length === 0) return;

  let currentSongIndex = songsList.findIndex(
    (song) => song._id === currentPlayingSong,
  );

  // ================= DEFAULT TRACKS =================
  if (currentSongIndex === -1 && roomData.room.defaultTracks) {
    const defaultIndex = defaultSongs.findIndex(
      (song) => `default-${song.name}` === currentPlayingSong,
    );

    // 🚨 Song not found in defaults
    if (defaultIndex === -1) return;

    // --- At first default song ---
    if (defaultIndex === 0) {
      if (songsList.length > 0) {
        const lastUserSong = songsList[songsList.length - 1];
        setcurrentSongId(lastUserSong._id);
        setcurrentSongDuration(formatTime(lastUserSong.duration));
        setCurrentSongUpdate(true);
        return;
      }

      const lastDefault = defaultSongs[defaultSongs.length - 1];
      if (!lastDefault) return;

      setDefaultCurrentSongId(`default-${lastDefault.name}`);
      setDefaultCurrentSongUrl(lastDefault.url);
      setcurrentSongDuration(lastDefault.duration);
      setDefaultCurrentSongUpdate(true);
      return;
    }

    // --- Previous default song ---
    const prevDefault = defaultSongs[defaultIndex - 1];
    if (!prevDefault) return;

    setDefaultCurrentSongId(`default-${prevDefault.name}`);
    setDefaultCurrentSongUrl(prevDefault.url);
    setcurrentSongDuration(prevDefault.duration);
    setDefaultCurrentSongUpdate(true);
    return;
  }

  // ================= USER SONGS =================
  if (currentSongIndex === -1) return; // 🚨 Not found anywhere

  if (currentSongIndex === 0) {
    if (roomData.room.defaultTracks && defaultSongs.length > 0) {
      const lastDefault = defaultSongs[defaultSongs.length - 1];
      if (!lastDefault) return;

      setDefaultCurrentSongId(`default-${lastDefault.name}`);
      setDefaultCurrentSongUrl(lastDefault.url);
      setcurrentSongDuration(lastDefault.duration);
      setDefaultCurrentSongUpdate(true);
      return;
    }

    const lastUserSong = songsList[songsList.length - 1];
    if (!lastUserSong) return;

    setcurrentSongId(lastUserSong._id);
    setcurrentSongDuration(formatTime(lastUserSong.duration));
  } else {
    const prevUserSong = songsList[currentSongIndex - 1];
    if (!prevUserSong) return;

    setcurrentSongId(prevUserSong._id);
    setcurrentSongDuration(formatTime(prevUserSong.duration));
  }

  setCurrentSongUpdate(true);
};

  useEffect(() => {
    if (!playNextSong) return;
    playNextSongFunction();
    setPlayNextSong(false);
  }, [playNextSong]);

  useEffect(() => {
    if (!songEnds) return;
    playNextSongFunction();
    setSongEnds(false);
  }, [songEnds]);

  useEffect(() => {
    if (!playPreviousSong) return;
    playPreviousSongFunction();
    setPlayPreviousSong(false);
  }, [playPreviousSong]);

  useEffect(() => {
    if (currentSongUpdate) {
      if (!SongUrl || !currentSongId) return;

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
      if (!defaultCurrentSongUrl || !defaultCurrentSongId) return;

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
                    {`default-${song?.name}` === roomData?.room.currentSong &&
                    roomData.room.currentSongState ? (
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
                    setcurrentSongDuration(formatTime(song.duration));
                    setCurrentSongUpdate(true);
                  }
                }}
              >
                {song._id === roomData?.room.currentSong &&
                roomData.room.currentSongState ? (
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
                <p className="text-neutral-400">{formatTime(song.duration)}</p>
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
