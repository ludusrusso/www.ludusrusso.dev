import { getNextEpisode } from "utils/getNextEpisode";
import { createRouter } from "./utils";

export const openRouter = t.router({
    getNextEpisode: t.procedure.query(({ ctx }) => {
        return getNextEpisode(ctx.db);
    }),
})
;
