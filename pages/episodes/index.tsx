import { Footer } from "components/footer";
import { Nav } from "components/nav";
import { SEO } from "components/seo";
import { InferGetStaticPropsType } from "next";
import { db } from "services/db";
import { formatDate } from "utils/episodeDate";
import { getParticipantImage } from "utils/participants";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
type Episode = PageProps["episodes"][number];

const EpisodesPage = ({ episodes }: PageProps) => {
  return (
    <>
      <SEO title="Home" />
      <Nav />
      <div className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl">
          <div>
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Lista Episodi
            </h2>
          </div>
          <div className="mt-6 pt-10 grid gap-16 lg:gap-x-5 lg:gap-y-12">
            {episodes.map((episode) => (
              <EpisodeLink episode={episode} key={episode.id} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const EpisodeLink = ({ episode }: { episode: Episode }) => {
  const participants = [episode.host, ...episode.guests.map((g) => g.guest)];
  return (
    <div>
      <p className="text-sm text-gray-500">
        <time dateTime={episode.scheduledTime.toISOString()}>
          {formatDate(episode.scheduledTime)}
        </time>

        <div className="flex gap-x-4">
          {participants.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              className="rounded-full mt-2 w-7 h-7"
              src={getParticipantImage(p, 28)}
              alt={p.name}
            />
          ))}
        </div>
      </p>

      <div className="mt-2 block">
        <p className="text-xl font-semibold text-gray-900">
          {episode.title.replace(/\*/g, "")}
        </p>
        <p className="mt-3 text-base text-gray-500">{episode.description}</p>
      </div>

      <div className="mt-3">
        {episode.youtube && (
          <a
            className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
            href={`https://www.youtube.com/watch?v=${episode.youtube}`}
            target="_blank"
            rel="noreferrer"
          >
            Guarda su YouTube
          </a>
        )}
      </div>
    </div>
  );
};

export default EpisodesPage;

export const getStaticProps = async () => {
  const episodes = await db.episode.findMany({
    orderBy: {
      scheduledTime: "desc",
    },
    include: {
      host: true,
      guests: {
        include: {
          guest: true,
        },
      },
    },
  });

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60,
  };
};
