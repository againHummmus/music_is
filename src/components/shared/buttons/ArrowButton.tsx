import Link from 'next/link';
import HugeiconsArrowRight02 from '~icons/hugeicons/arrow-right-02?width=24px&height=24px';

export function ArrowButton({
  title,
  href,
  color,
  maxWidth,
}: {
  title: string;
  href: string;
  color: string;
  maxWidth?: string;
}) {
  return (
    <Link
      className={`group flex w-full cursor-pointer flex-row justify-between rounded-[7px] px-10 py-5 text-white transition-all hover:bg-opacity-80 bg-${color}`}
      style={{ maxWidth }}
      href={href}
    >
      <div>{title}</div>
      <HugeiconsArrowRight02 className="-translate-x-1 transition-all group-hover:translate-x-0" />
    </Link>
  );
}
