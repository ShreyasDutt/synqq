"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { displayNameAtom } from "@/atoms/atoms";
import { generateRandomName } from "@/lib/generateName";
import { TextAnimate } from "../ui/text-animate";

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
      You'll join as <div className="font-semibold flex"><TextAnimate animation="blurIn" duration={0.7} as={'p'}>{displayName}</TextAnimate></div>
      <button
        className="text-gray-500 cursor-pointer"
        onClick={() => setRegenerate((v) => !v)}
      >
        Regenerate
      </button>
    </>
  );
};

export default DisplayName;
