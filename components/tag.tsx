export const Tag = ({ tag }: { tag: string }) => {
  return (
    <div className="flex items-center">
      <span
        key={tag}
        className={classNames(
          `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800`,
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
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

const colorsClasses: { [key: string]: string } = {
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

const colors = Object.keys(colorsClasses);

const getColor = (tag: string): string => {
  const color = colors[hashCode(tag) % colors.length];
  return colorsClasses[color];
};
