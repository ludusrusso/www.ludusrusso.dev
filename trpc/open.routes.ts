import { getNextEpisode } from "utils/getNextEpisode";
import { createRouter } from "./utils";

export const openRouter = createRouter().query("getNextEpisode", {
  resolve({ ctx }) {
    return getNextEpisode(ctx.db);
  },
});
