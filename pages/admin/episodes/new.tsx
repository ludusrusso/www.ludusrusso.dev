import { EpisodeForm } from "admin/episodes/episodes.form";
import { AdminLayout } from "layouts/admin";
import Router from "next/router";
import { trpc } from "utils/trpc";

const NewEpisodePage = () => {
  const { data } = trpc.useQuery(["participants.getAll", {}]);
  const { mutateAsync: createEpisode } = trpc.useMutation("episodes.create");

  return (
    <AdminLayout>
      <h1>Create Episode</h1>
      <EpisodeForm
        participants={data?.participants || []}
        onSubmit={async (form: any) => {
          try {
            await createEpisode(form);
            Router.push("/admin/episodes");
          } catch {}
        }}
      />
    </AdminLayout>
  );
};

export default NewEpisodePage;
