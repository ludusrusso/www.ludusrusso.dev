import type { Episode, EpisodeGuest, Participant } from "@prisma/client";
import dayjs from "dayjs";
import { getParticipantImage } from "utils/participants";
import { trpc } from "utils/trpc";
import "dayjs/locale/it";

export const NextEpisode = () => {
  const { data: episode } = trpc.useQuery(["open.getNextEpisode"]);
  if (!episode) {
    return null;
  }

  return (
    <div className="mx-2 my-10">
      <div className="relative bg-white py-10 shadow-xl lg:max-w-3xl mx-auto  rounded">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-3xl">
          <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">
            Il prossimo episodio è {getTimeToEpisode(episode.scheduledTime)}
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            {episode.title}
          </p>
          <p className="mt-1 max-w-prose mx-auto text-lg text-gray-900">
            {dayjs(episode.scheduledTime)
              .locale("it")
              .format("dddd DD MMMM YYYY ore HH:mm")}
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
            {episode.description}
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-auto lg:grid-cols-auto">
              <div className="lg:col-span-2">
                <ul
                  role="list"
                  className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8 text-left"
                >
                  {[episode.host, ...episode.guests.map((g) => g.guest)].map(
                    (person) => (
                      <li key={person.name}>
                        <div className="flex items-center space-x-4 lg:space-x-6">
                          <img
                            className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
                            src={getParticipantImage(person, 100)}
                            alt={person.name}
                          />
                          <div className="font-medium text-lg leading-6 space-y-1">
                            <h3>{person.name}</h3>
                            <p className="text-indigo-600">{person.bio}</p>
                          </div>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <a
            type="button"
            className="mt-10 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href={`https://twitch.tv/${episode.twitch}`}
          >
            Guarda su Twitch
          </a>
        </div>
      </div>
    </div>
  );
};

const getTimeToEpisode = (date: Date) => {
  const daysToEpisode = dayjs(date).diff(new Date(), "day");
  if (daysToEpisode > 1) {
    return `tra ${daysToEpisode} giorni`;
  }

  if (!isToday(date)) {
    return `domani`;
  }

  if (dayjs(date).isBefore(new Date())) {
    return "live adesso!";
  }

  return `oggi alle ${dayjs(date).hour()}`;
};

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};