import styled from "@emotion/styled";
import { Episode, EpisodeGuest, Participant } from "@prisma/client";
import { getParticipantImage } from "utils/participants";

export interface EventCoverProps {
  episode: Episode & {
    host: Participant;
    guests: (EpisodeGuest & {
      guest: Participant;
    })[];
  };
}

export const EventCover = ({ episode }: EventCoverProps) => {
  const host = episode.host;
  const guests = episode.guests.map((g) => g.guest);
  return (
    <div className="aspect-video relative w-[1024px] bg-zinc-100 grid grid-rows-[1fr_auto]">
      <CoverStyled />
      <div className="relative">
        <div className="w-1/2 h-full grid place-content-center z-20">
          <h2 className="text-blue-800 text-5xl leading-tight font-bold pl-10 ">
            <div
              dangerouslySetInnerHTML={{
                __html: episode.title.replace(
                  /\*([^\*]+)\*/g,
                  (data, ar) => `<span class="px-2 bg-green-300">${ar}</span>`
                ),
              }}
            ></div>
          </h2>
        </div>
        {guests.length === 1 ? (
          <>
            <div className="absolute right-10 bottom-20">
              <SmallUser guest={host} />
            </div>
            <div className="absolute right-52 bottom-28">
              <BigUser guest={guests[0]!} />
            </div>
          </>
        ) : guests.length === 2 ? (
          <>
            <div className="absolute right-[10px] bottom-[10px]">
              <SmallUser guest={host} />
            </div>
            <div className="absolute right-[170px] top-[150px]">
              <SmallUser guest={guests[0]!} />
            </div>
            <div className="absolute right-[330px] top-[50px]">
              <SmallUser guest={guests[1]!} />
            </div>
          </>
        ) : (
          <div className="absolute right-40 bottom-28">
            <BigUser guest={host} />
          </div>
        )}
      </div>
      <div className="relative bg-blue-800 h-12 px-4 text-green-300 flex justify-between items-center">
        <p className="text-xl">{date2EventCoverTime(episode.scheduledTime)}</p>
        <p className="text-2xl font-bold">{episode.category}</p>
      </div>
    </div>
  );
};

const CoverStyled = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 200px;
  right: 0;
  background: linear-gradient(
      270deg,
      rgb(244 244 245) 0%,
      rgba(218, 218, 218, 0) 44.3%
    ),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2373D06F' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  transform: matrix(-1, 0, 0, 1, 0, 0);
`;

const SmallUser = ({ guest }: { guest: Participant }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[200px] aspect-square overflow-hidden rounded-full border-[6px] border-solid border-green-500">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="object-cover"
            width={200}
            height={200}
            src={getParticipantImage(guest)}
            alt={guest.name}
          />
        }
      </div>
      <p className="text-blue-800 mt-2 text-center text-2xl w-[180px] font-black">
        {guest.name}
      </p>
    </div>
  );
};

const BigUser = ({ guest }: { guest: Participant }) => {
  return (
    <div className="flex flex-col items-center ">
      <div className="rounded-full w-[300px] aspect-square overflow-hidden block border-[6px] border-solid border-green-500">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="object-cover"
            width={300}
            height={300}
            src={getParticipantImage(guest)}
            alt={guest.name}
          />
        }
      </div>

      <p className="text-blue-800 mt-2 text-2xl text-center w-[270px] font-black">
        {" "}
        {guest.name}{" "}
      </p>
    </div>
  );
};

const mounths = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const days = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

const date2EventCoverTime = (d: string | Date) => {
  const date = new Date(d);
  console.log("date.getDay() - 1", date.getDay());
  return `${days[date.getDay()]} ${date.getDate()} ${
    mounths[date.getMonth()]
  } ${date.getFullYear()} - ${padTime(date.getHours())}.${padTime(
    date.getMinutes()
  )}`;
};

const padTime = (num: number) => {
  return `00${num}`.slice(-2);
};
