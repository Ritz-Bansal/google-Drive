interface ILeftBarButton {
  content: string;
  onCLickHandler: () => void;
  variant?: "default" | "outline";
}

function LeftBarButton({ content, onCLickHandler, variant = "default" }: ILeftBarButton) {
  const base =
    "rounded-4xl font-medium text-sm py-3 px-4 w-[75%] transition-all duration-200 cursor-pointer";
  const styles =
    variant === "outline"
      ? `${base} bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3BAD9E]`
      : `${base} bg-white text-[#3BAD9E] hover:bg-[#eaf6f4] shadow-sm`;

  return (
    <div className="w-full flex justify-center">
      <button className={styles} onClick={onCLickHandler}>
        {content}
      </button>
    </div>
  );
}

export default LeftBarButton;