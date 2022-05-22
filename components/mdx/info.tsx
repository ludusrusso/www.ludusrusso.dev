import { InformationCircleIcon } from "@heroicons/react/outline";

export const InfoBox = ({
  children,
  type = "info",
}: {
  children: JSX.Element;
  type: keyof typeof types;
}) => {
  const t = types[type];
  return (
    <div className={`${t.bgColor} px-4 py-2 rounded-lg shadow-lg`}>
      <div>
        <InformationCircleIcon className={`h-8 w-8 ${t.iconColor}`} />
      </div>
      <div> {children}</div>
    </div>
  );
};

const types = {
  info: {
    icon: InformationCircleIcon,
    bgColor: "bg-blue-200",
    iconColor: "text-blue-400",
  },
  warn: {
    icon: InformationCircleIcon,
    bgColor: "bg-orange-200",
    iconColor: "text-orange-400",
  },
};
