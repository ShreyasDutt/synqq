"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { joinRoomAction } from "@/app/actions/room.actions";
import { useAtom, useSetAtom } from "jotai";
import { createdRoomAtom, displayNameAtom } from "@/atoms/atoms";
import { useRouter } from "next/navigation";

const CreateRoomButton = () => {
  const router = useRouter();
  const [displayName] = useAtom(displayNameAtom);
  const setCreatedRoom = useSetAtom(createdRoomAtom);
  return (
    <Button
      className={"2xl:h-10"}
      onClick={async() => {
        const createdRoomCode = await joinRoomAction({displayName});
        setCreatedRoom(true);
        router.push(`/room/${createdRoomCode}`)

      }}
    >
      <PlusCircle />
      Create new Room
    </Button>
  );
};

export default CreateRoomButton;
