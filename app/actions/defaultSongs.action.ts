"use server"
import path from "path";
import fs from "fs";
import { parseFile } from "music-metadata";

export const getdefaultSongsAction = async () => {
  const songsDir = path.join(process.cwd(), "/public/songs");
    const defaultSongs = fs.readdirSync(songsDir);
    
    const songs = await Promise.all(
        defaultSongs.map(async(song) => {
            const songPath = path.join(songsDir, song);

            try {
                const metadata = await parseFile(songPath);
                const duration = metadata.format.duration;
                if (!duration) return null;
                 const mins = Math.floor(duration / 60);
                 const secs = Math.floor(duration % 60)
                   .toString()
                   .padStart(2, "0");
                 const formattedDuration = `${mins}:${secs}`;
                return {
                    name: song,
                    duration: formattedDuration,
                    url: `/songs/${song}`
                }
            } catch (error) {
                return console.error('Error while getting duration of the default Tracks: ', error);
                
            }
        })
    )

    return songs;
};
