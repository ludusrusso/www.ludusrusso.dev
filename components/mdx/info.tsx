import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const InfoBox = ({
  children,
  type = "info",
  title,
}: {
  children: JSX.Element;
  type: keyof typeof types;
  title?: string;
}) => {
  const t = types[type];
  return (
    <div className={`${t.bgColor} px-4 rounded-lg pb-2`}>
      <div className="not-prose flex pt-4">
        <span>
          <InformationCircleIcon className={`h-8 w-8 ${t.iconColor}`} />
        </span>

        {title && <span className="font-bold ml-2">{title}</span>}
      </div>
      <div> {children}</div>
    </div>
  );
};

const types = {
  info: {
    icon: InformationCircleIcon,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-400",
  },
  warn: {
    icon: InformationCircleIcon,
    bgColor: "bg-orange-200",
    iconColor: "text-orange-400",
  },
};
