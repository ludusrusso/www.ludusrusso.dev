import { useQuery } from '@apollo/client';
import { GetParticipantsDocument, LoginDocument } from '../../utils/graphql';

export const Participants = () => {
  const { data, loading, error } = useQuery(GetParticipantsDocument, { variables: { skip: 0, take: 1000 } });
  if (loading) {
    return <p>loading</p>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
