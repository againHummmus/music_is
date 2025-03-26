import Link from "next/link";
import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";

export function ArrowButton({
  title,
  href,
  color,
  maxWidth
}: {
  title: string;
  href: string;
  color: string;
  maxWidth?: string
}) {
  return (
    <Link
      className={`cursor-pointer group hover:bg-opacity-80 transition-all w-full px-10 py-5 text-mainWhite rounded-[7px] flex flex-row justify-between bg-${color}`}
      style={{ maxWidth }}
      href={href}
    >
      <div>{title}</div>
      <HugeiconsArrowRight02 className="-translate-x-1 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}
