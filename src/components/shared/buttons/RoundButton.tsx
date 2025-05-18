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
      className={`w-[50px] flex items-center justify-center cursor-pointer bg-mainDark hover:bg-mainBlack text-white  hover:text-mainOrange rounded-full aspect-square transition-all`}
    >
        {loading ? (
          <div className="animate-spin rounded-full h-[50%] w-[50%] border-[3px] border-white border-b-transparent"></div>
        ) : (
          title
        )}
    </button>
  );
}
