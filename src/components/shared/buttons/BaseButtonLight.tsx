import Link from 'next/link';

export function BaseButtonLight({
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
      className="flex h-[30px] w-full items-center justify-center rounded-[7px] bg-mainOrange font-bold text-mainDark transition-all hover:bg-mainWhite hover:text-mainOrange main:h-[40px]"
      href={href}
      style={{ maxWidth }}
    >
      {title}
    </Link>
  );
}
