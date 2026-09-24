import Link from 'next/link';

export function BaseButtonOutline({
  title,
  href,
  maxWidth,
}: {
  title: string;
  href: string;
  maxWidth?: string;
}) {
  return (
    <Link
      className="flex h-[30px] w-full items-center justify-center rounded-[7px] border-2 border-mainOrange font-bold text-mainOrange backdrop-blur-md transition-all hover:border-mainWhite hover:text-mainWhite main:h-[40px]"
      href={href}
      style={{ maxWidth }}
    >
      {title}
    </Link>
  );
}
