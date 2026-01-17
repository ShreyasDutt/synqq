import { Id } from "../convex/_generated/dataModel";
import { MutationCtx } from "../convex/_generated/server";

const STALE_MS = 20_000;

export async function cleanupStaleParticipants(
  ctx: MutationCtx,
  roomId: Id<"room">
) {
  const cutoff = Date.now() - STALE_MS;

  const staleParticipants = await ctx.db
    .query("participant")
    .withIndex("byRoomId", q => q.eq("roomId", roomId))
    .filter(q => q.lt(q.field("lastSeen"), cutoff))
    .collect();

  for (const p of staleParticipants) {
    await ctx.db.delete(p._id);
  }
}
