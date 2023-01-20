import { BookOpenIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ComponentProps, FC } from "react";

export const Banner = () => {
  return (
    <BannerWithProps
      Icon={BookOpenIcon}
      btn="Visita"
      href="/books"
      long="Novità! Ecco la nuova sezione dei libri consigliati."
      short="Nuova sezione libri disponibile!"
    />
  );
};

interface BannterProps {
  long: string;
  short: string;
  btn: string;
  Icon: FC<ComponentProps<"svg">>;
  href: string;
}

const BannerWithProps = ({ long, btn, short, Icon, href }: BannterProps) => {
  return (
    <div className="">
      <div className="">
        <div className="bg-teal-600 p-2 shadow-lg sm:p-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-teal-800 p-2">
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <p className="ml-3 truncate font-medium text-white">
                <span className="md:hidden">{short}</span>
                <span className="hidden md:inline">{long}</span>
              </p>
            </div>
            <div className="mt-0  w-auto flex-shrink-0">
              <Link href={href}>
                <a className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-teal-600 shadow-sm hover:bg-cyan-50">
                  {btn}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
