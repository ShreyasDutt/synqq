"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Card, CardDescription, CardFooter, CardTitle } from "../ui/card";
import DisplayName from "./DisplayName";
import CreateRoomButton from "./CreateRoomButton";

const JoinwithCode = () => {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-92 lg:w-106 2xl:w-113 flex">
        <div className="flex items-center justify-center flex-col gap-4">
          <CardTitle className="text-sm font-light text-gray-600 flex items-center gap-2">
            <p className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse"></p>
            25 people are listening now
          </CardTitle>
          <CardTitle className=" 2xl:text-lg">Join a Synq Room</CardTitle>
          <CardDescription>
            Enter a room code to join or create a new room
          </CardDescription>
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <CardDescription className="flex items-center justify-center gap-1 my-2">
            <DisplayName />
          </CardDescription>
        </div>

        <CardFooter className="flex items-center justify-center">
          <CreateRoomButton />
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinwithCode;
