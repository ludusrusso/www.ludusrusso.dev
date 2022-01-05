import dayjs from "dayjs";
import "dayjs/locale/it";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: Date) =>
  dayjs(date)
    .tz("europe/rome")
    .locale("it")
    .format("dddd DD MMMM YYYY ore HH:mm");

export { dayjs };
