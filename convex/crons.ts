import { cronJobs } from "convex/server";
import {internal} from "./_generated/api"

const crons = cronJobs();

crons.interval(
    "delete inactive users every minute",
    { minutes: 1 },
    internal.room.deleteInactiveParticipants
)
export default crons;
