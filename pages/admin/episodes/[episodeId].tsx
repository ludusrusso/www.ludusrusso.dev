import { EpisodeForm } from "admin/episodes/episodes.form";
import { AdminLayout } from "layouts/admin";
import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import { useRef } from "react";
import { trpc } from "utils/trpc";

const DownloadEpisode = dynamic(() => import("components/events/downlaod"), {
  ssr: false,
});

const EpisodePage = () => {
  const router = useRouter();

  const episodeId = router.query.episodeId as string;
  const { data } = trpc.useQuery(["participants.getAll", {}]);
  const { data: episode } = trpc.useQuery([
    "episodes.getById",
    { id: episodeId },
  ]);
  const { mutateAsync: createEpisode } = trpc.useMutation("episodes.create");
  const coverRef = useRef<HTMLDivElement>(null);
  return (
    <AdminLayout>
      <h1>Get Episode</h1>
      {episode && <DownloadEpisode episode={episode} />}
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

export default EpisodePage;
