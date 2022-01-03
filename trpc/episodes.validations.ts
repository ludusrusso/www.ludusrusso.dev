import { z } from "zod";

export const CreateEpisodeSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(200),
  scheduledTime: z
    .string()
    .refine((d: string) => !Number.isNaN(new Date(d).getTime()), {
      message: "Invalid date",
    }),
  youtube: z.string().optional(),
  twitch: z.string(),
  repo: z.string().optional(),
  guestId1: z.string().optional(),
  guestId2: z.string().optional(),
  hostId: z.string(),
});
