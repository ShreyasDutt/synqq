"use client";

import { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  roomCodeAtom,
  audioEnabledAtom,
  currentSongTimeAtom,
} from "@/atoms/atoms";
import { songEndsAtom, songInputValueAtom } from "@/atoms/song";

export default function AudioPlayer() {
  const [roomCode] = useAtom(roomCodeAtom);
  const [audioEnabled] = useAtom(audioEnabledAtom);
  const [, setCurrentSongTime] = useAtom(currentSongTimeAtom);
  const setSongEnds = useSetAtom(songEndsAtom);
  const [songInputValue] = useAtom(songInputValueAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }

  const roomData = useQuery(api.room.getRoomData, {
    roomCode: Number(roomCode),
  });

  const songUrl = roomData?.room.currentSongUrl ?? null;
  const isPlaying = roomData?.room.currentSongState === true;
  const flipSongState = useMutation(api.song.FlipSongPlayState);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentSongTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [setCurrentSongTime]);

  // useEffect(() => {
  //   const audio = audioRef.current!;
  //   if (!audio) return;
  //   audio.currentTime = songInputValue;

  // }, [songInputValue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl || !audioEnabled) return;

    if (audio.src !== songUrl) {
      audio.src = songUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      setCurrentSongTime(audio.currentTime);
      audio.currentTime = roomData?.room.currentSongProgress || 0;
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("Autoplay blocked");
        });
      }
    } else {
      audio.pause();
      setCurrentSongTime(audio.currentTime);
    }
  }, [songUrl, isPlaying, audioEnabled]);

  useEffect(() => {
    if (!audioRef.current || roomData?.room.globalVolume == null) return;

    const normalizedVolume = roomData.room.globalVolume / 100;
    audioRef.current.volume = Math.max(0, Math.min(1, normalizedVolume));
  }, [roomData?.room.globalVolume]);

  const handlePlay = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying: true,
      currentSongTime: audio.currentTime,
    });
  };

  const handlePause = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying: false,
      currentSongTime: audio.currentTime,
    });
  };

  const handleSeeked = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying,
      currentSongTime: audio.currentTime,
    });
  };

  return (
    <audio
      ref={audioRef}
      preload="auto"
      hidden
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      onSeeked={handleSeeked}
      onEnded={() => setSongEnds(true)}
    />
  );
}
