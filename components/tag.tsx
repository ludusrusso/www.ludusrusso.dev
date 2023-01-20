export const Tag = ({ tag }: { tag: string }) => {
  return (
    <div className="flex items-center">
      <span
        key={tag}
        className={classNames(
          `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium`,
          getColor(tag)
        )}
      >
        {tag}
      </span>
    </div>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const hashCode = (s: string) =>
  s.split("").reduce((a, b) => {
    a += b.charCodeAt(0);
    return a;
  }, 0);

const colorsClasses: { [key: string]: string } = {
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orage: "bg-orange-100 text-orange-800",
  purple: "bg-purple-100 text-purple-800",
  pink: "bg-pink-100 text-pink-800",
  amber: "bg-amber-100 text-amber-800",
  teal: "bg-teal-100 text-teal-800",
  cyan: "bg-cyan-100 text-cyan-800",
  lime: "bg-lime-100 text-lime-800",
  emerald: "bg-emerald-100 text-emerald-800",
  indigo: "bg-indigo-100 text-indigo-800",
  fuchsia: "bg-fuchsia-100 text-fuchsia-800",
  rose: "bg-rose-100 text-rose-800",
};

const colors = Object.keys(colorsClasses);

const getColor = (tag: string): string => {
  const hash = hashCode(tag) % colors.length;
  const color = colors[hash];
  const classes = colorsClasses[color];
  return classes;
};
