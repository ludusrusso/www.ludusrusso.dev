import { EpisodeForm } from "admin/episodes/episodes.form";
import { AdminLayout } from "layouts/admin";
import Router from "next/router";
import { trpc } from "utils/trpc";

const NewEpisodePage = () => {
  const { data } = trpc.participants.getAll.useQuery({});
  const { mutateAsync: createEpisode } = trpc.episodes.create.useMutation();

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
