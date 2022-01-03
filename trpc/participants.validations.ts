import { z } from "zod";

export const CreateParticipantSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().min(10).max(50),
  github: z.string(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  site: z.string().optional(),
  twitter: z.string().optional(),
});
