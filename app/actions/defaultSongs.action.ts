"use server";
import path from "path";
import fs from "fs";
import { parseFile } from "music-metadata";

type Song = {
  name: string;
  duration: string;
  url: string;
};

export const getdefaultSongsAction = async (): Promise<Song[]> => {
  const songsDir = path.join(process.cwd(), "public", "songs");
  const files = fs.readdirSync(songsDir);

  const results = await Promise.all(
    files.map(async (file): Promise<Song | null> => {
      const songPath = path.join(songsDir, file);

      try {
        const metadata = await parseFile(songPath);
        const duration = metadata.format.duration;

        if (!duration) return null;

        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60)
          .toString()
          .padStart(2, "0");

        return {
          name: file,
          duration: `${mins}:${secs}`,
          url: `/songs/${file}`,
        };
      } catch (err) {
        console.error("Error while getting duration:", err);
        return null; // <- important: don't return console.error(...)
      }
    }),
  );

  // remove nulls and tell TS it's now Song[]
  return results.filter((s): s is Song => s !== null);
};
