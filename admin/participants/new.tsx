import { useMutation } from '@apollo/client';
import { CreateParticipantDocument } from '../../utils/graphql';
import { ParticipantForm } from './components/ParticipantForm';
import { useNavigate } from 'react-router-dom';

export const NewParticipantPage = () => {
  const nav = useNavigate();
  const [createParticipant] = useMutation(CreateParticipantDocument);
  return (
    <div>
      <h1>test</h1>
      <ParticipantForm
        onSubmit={async (form) => {
          await createParticipant({ variables: { form } });
          nav('..');
        }}
      />
    </div>
  );
};
