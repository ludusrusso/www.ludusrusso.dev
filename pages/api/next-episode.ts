import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { db } from "services/db";
import { getNextEpisode } from "trpc/open.routes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  if (req.method === "GET") {
    const next = await getNextEpisode(db);
    if (next) {
      return res.status(200).json(next);
    }
    res.status(404);
  }
}
