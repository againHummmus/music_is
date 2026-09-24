import Link from 'next/link';

export function BaseButtonDark({
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
      className="flex h-[30px] w-full items-center justify-center rounded-[7px] bg-mainOrange font-bold text-mainDark transition-all hover:text-mainWhite main:h-[40px]"
      href={href}
      style={{ maxWidth }}
    >
      {title}
    </Link>
  );
}
