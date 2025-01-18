import Link from "next/link";

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
      className="w-full font-bold h-[30px] main:h-[40px] rounded-[7px] border-2 border-mainOrange hover:border-mainWhite hover:text-mainWhite transition-all flex items-center justify-center text-mainOrange backdrop-blur-md"
      href={href}
      style={{ maxWidth }}
    >
      {title}
    </Link>
  );
}
