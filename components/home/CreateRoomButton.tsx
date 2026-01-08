"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { joinRoomAction } from "@/app/actions/room.actions";
import { useAtom, useSetAtom } from "jotai";
import { createdRoomAtom, displayNameAtom } from "@/atoms/atoms";

const CreateRoomButton = () => {
  const [displayName] = useAtom(displayNameAtom);
  const setCreatedRoom = useSetAtom(createdRoomAtom);
  return (
    <Button
      className={"2xl:h-10"}
      onClick={() => {
        joinRoomAction(displayName);
        setCreatedRoom(true);
      }}
    >
      <PlusCircle />
      Create new Room
    </Button>
  );
};

export default CreateRoomButton;
