import type { MouseEventHandler, ReactNode } from "react";

type IconButtonProps = {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
};

const IconButton = ({
  icon,
  onClick,
  className = "",
  ariaLabel = "",
}: IconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition duration-300 ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
