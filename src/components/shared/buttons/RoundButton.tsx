export function RoundButton({
  title,
  loading,
  onClick,
  disabled
}: {
  title: string;
  loading: boolean,
  onClick: () => void
  disabled?: any
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`p-[8px] cursor-pointer bg-mainDark hover:bg-mainBlack text-white  hover:text-mainOrange rounded-full aspect-square w-fit transition-all`}
    >
      <div className="text-xl">
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          title
        )}
      </div>
    </button>
  );
}
