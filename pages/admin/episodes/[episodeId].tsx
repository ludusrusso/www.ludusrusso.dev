import { EpisodeForm } from "admin/episodes/episodes.form";
import { AdminLayout } from "layouts/admin";
import dynamic from "next/dynamic";
import Router from "next/router";
import { useRef } from "react";
import { trpc } from "utils/trpc";

const DownloadEpisode = dynamic(() => import("components/events/downlaod"), {
  ssr: false,
});

const NewEpisodePage = () => {
  const { data } = trpc.useQuery(["participants.getAll", {}]);
  const { data: episode } = trpc.useQuery([
    "episodes.getById",
    { id: "ckyyafgrp007209k5xweh0ars" },
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

export default NewEpisodePage;
