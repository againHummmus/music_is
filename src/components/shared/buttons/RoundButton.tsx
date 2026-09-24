export function RoundButton({
  title,
  loading,
  onClick,
  disabled,
}: {
  title: string;
  loading: boolean;
  onClick: () => void;
  disabled?: any;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex aspect-square w-[50px] cursor-pointer items-center justify-center rounded-full bg-mainDark text-white transition-all hover:bg-mainBlack hover:text-mainOrange disabled:cursor-not-allowed disabled:bg-mainDark/80 disabled:hover:text-white`}
    >
      {loading ? (
        <div className="h-[50%] w-[50%] animate-spin rounded-full border-[3px] border-white border-b-transparent"></div>
      ) : (
        title
      )}
    </button>
  );
}
