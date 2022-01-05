import { Footer } from "components/footer";
import { Nav } from "components/nav";
import { SEO } from "components/seo";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { db } from "services/db";
import { formatDate } from "utils/episodeDate";

const EpisodesPage = ({
  episodes,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
              <div key={episode.title}>
                <p className="text-sm text-gray-500">
                  <time dateTime={episode.scheduledTime.toISOString()}>
                    {formatDate(episode.scheduledTime)}
                  </time>
                </p>
                <a href="#" className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900">
                    {episode.title}
                  </p>
                  <p className="mt-3 text-base text-gray-500">
                    {episode.description}
                  </p>
                </a>
                <div className="mt-3">
                  <Link href={`/episodes/${episode.id}`}>
                    <a className="text-base font-semibold text-indigo-600 hover:text-indigo-500">
                      Read full story
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
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
  };
};
