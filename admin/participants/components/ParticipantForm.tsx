import { FormSpy, Form } from 'react-final-form';
import { z } from 'zod';
import { LabeledTextField } from '../../components/text-field';
import { zodValidate } from '../../utils/zodValidation';

export const CreateParticipantSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().min(10).max(50),
  github: z.string(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  site: z.string().optional(),
  twitter: z.string().optional(),
});

type CreateParticipant = z.infer<typeof CreateParticipantSchema>;

export const ParticipantForm = ({ onSubmit }: { onSubmit: (values: CreateParticipant) => void }) => {
  return (
    <div className="space-y-8 divide-y divide-stone-200">
      <div className="pt-8">
        <div>
          <h3 className="text-lg leading-6 font-medium text-stone-900">Aggiungi Guest</h3>
          <p className="mt-1 text-sm text-stone-500">Informazioni sul guest degli eventi</p>
        </div>
        <Form
          onSubmit={onSubmit}
          validate={zodValidate(CreateParticipantSchema)}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="max-w-2xl m-auto">
              <div className="mt-6 flex flex-col gap-4">
                <LabeledTextField name="name" type="text" label="Name" placeholder="Name" />
                <LabeledTextField name="email" type="email" label="Email" placeholder="Email" />
                <LabeledTextField name="bio" type="text" label="Bio" placeholder="frontend developer" />
                <LabeledTextField name="twitter" type="text" label="Twitter" placeholder="frontend developer" />
                <LabeledTextField name="youtube" type="text" label="YouTube" placeholder="frontend developer" />
                <LabeledTextField name="linkedin" type="text" label="Linkedin" placeholder="frontend developer" />
                <LabeledTextField name="github" type="text" label="GitHub Account" placeholder="xxx" />
              </div>
              <button type="submit"> Create User </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};
