import { EventCover, EventCoverProps } from "components/events/cover";
import { useRef } from "react";
import { exportComponentAsPNG } from "react-component-export-image";

const DonwloadEpisode = ({ episode }: EventCoverProps) => {
  const coverRef = useRef<HTMLDivElement>(null);

  return (
    <div className="m-auto p-10 grid place-content-center">
      <div ref={coverRef} className="bg-red-500">
        <EventCover episode={episode} />
      </div>
      <button onClick={() => exportComponentAsPNG(coverRef)}>
        Export As PNG
      </button>
    </div>
  );
};

export default DonwloadEpisode;
