import { AdminLayout } from "layouts/admin";
import Link from "next/link";
import { trpc } from "utils/trpc";

const ParticipantsIndexPage = () => {
  const { data, isLoading, error } = trpc.participants.getAll.useQuery({ skip: 0, take: 100 });
  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <AdminLayout>
      <Link href={"./participants/new"}> Create New</Link>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </AdminLayout>
  );
};

export default ParticipantsIndexPage;
