"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { displayNameAtom } from "@/atoms/atoms";
import { generateRandomName } from "@/lib/generateName";

const DisplayName = () => {
  const [regenerate, setRegenerate] = useState(false);
  const [displayName, setDisplayName] = useAtom(displayNameAtom);

  useEffect(() => {
    if (!displayName) setDisplayName(generateRandomName());
  }, [displayName, setDisplayName, regenerate]);

  useEffect(() => {
    setDisplayName(generateRandomName());
  }, [regenerate]);

  return (
    <>
      You'll join as <p className="font-semibold">{displayName}</p>
      <button
        className="text-gray-500"
        onClick={() => setRegenerate((v) => !v)}
      >
        Regenerate
      </button>
    </>
  );
};

export default DisplayName;
