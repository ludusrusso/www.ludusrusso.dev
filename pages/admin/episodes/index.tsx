import { AdminLayout } from "layouts/admin";
import Link from "next/link";
import { trpc } from "utils/trpc";

const EpisodesIndexPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "episodes.getAll",
    { skip: 0, take: 100 },
  ]);
  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <AdminLayout>
      <Link href={"./episodes/new"}> Create New</Link>
      <ul className="p-2">
        {data?.episodes.map((e) => (
          <li key={e.id} className="ml-9">
            <Link href={`./episodes/${e.id}`}>
              <a>{e.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default EpisodesIndexPage;
