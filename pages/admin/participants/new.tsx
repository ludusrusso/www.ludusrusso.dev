import { ParticipantForm } from "admin/participants/components/ParticipantForm";
import { AdminLayout } from "layouts/admin";
import Router from "next/router";
import { trpc } from "utils/trpc";

const NewParticipantPage = () => {
  const { mutateAsync: createParticipant } = trpc.useMutation(
    "participants.create"
  );

  return (
    <AdminLayout>
      <h1>Create Participant</h1>
      <ParticipantForm
        onSubmit={async (form) => {
          try {
            await createParticipant(form);
            Router.push("/admin/participants");
          } catch {}
        }}
      />
    </AdminLayout>
  );
};

export default NewParticipantPage;
