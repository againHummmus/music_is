import Link from "next/link";

export function RoundButton({
  title,
  onClick,
  disabled
}: {
  title: string;
  onClick: () => void
  disabled?: any
}) {
  return (
    <button
    disabled={disabled}
    onClick={onClick}
      className={`p-[8px] cursor-pointer bg-mainDark hover:bg-mainBlack text-white  hover:text-mainOrange rounded-full aspect-square w-fit transition-all`}
    >
      <div className="text-xl">{title}</div>
    </button>
  );
}
