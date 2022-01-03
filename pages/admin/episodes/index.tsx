import { AdminLayout } from "layouts/admin";
import Link from "next/link";
import { trpc } from "utils/trpc";

const EpisodesIndexPage = () => {
  const { data, isLoading, error } = trpc.useQuery([
    "episodes.getAll",
    { skip: 0, take: 100 },
  ]);
  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <AdminLayout>
      <Link href={"./episodes/new"}> Create New</Link>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </AdminLayout>
  );
};

export default EpisodesIndexPage;
