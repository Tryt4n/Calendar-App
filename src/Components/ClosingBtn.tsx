type ClosingBtnPropsType = {
  onClickFunction: () => void;
};

export default function ClosingBtn({ onClickFunction }: ClosingBtnPropsType) {
  return (
    <button
      className="close-btn"
      aria-label="Zamknij okno"
      onClick={onClickFunction}
    >
      &times;
    </button>
  );
}
