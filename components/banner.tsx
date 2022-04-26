import { BookOpenIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";

export const Banner = () => {
  return (
    <div className="bg-green-600">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-green-800">
              <BookOpenIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">
                Nuova sezione libri disponibile!
              </span>
              <span className="hidden md:inline">
                Novità! Ecco la nuova sezione dei libri consigliati.
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <Link href="/books">
              <a
                href="#"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-indigo-50"
              >
                Visita
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
