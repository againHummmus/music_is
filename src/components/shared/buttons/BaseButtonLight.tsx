import Link from "next/link";

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
      className="w-full font-bold h-[30px] main:h-[40px] rounded-[7px] hover:bg-mainWhite bg-mainOrange text-mainDark transition-all flex items-center justify-center hover:text-mainOrange"
      href={href}
      style={{ maxWidth }}
    >
      {title}
    </Link>
  );
}
