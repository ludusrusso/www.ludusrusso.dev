import { Link, Route, Routes } from 'react-router-dom';
import { Participants } from './list';
import { NewParticipantPage } from './new';

export const ParticipantPage = () => {
  return (
    <>
      <div>
        <Link to="./new"> Create Participant </Link>
      </div>
      <Routes>
        <Route path="new" element={<NewParticipantPage />} />
        <Route index element={<Participants />} />
      </Routes>
    </>
  );
};
