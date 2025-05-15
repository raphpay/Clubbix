type SidebarButtonProps = {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  isDisabled?: boolean;
};

const SidebarButton = ({
  title,
  icon,
  onClick,
  isActive,
  isDisabled,
}: SidebarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:text-blue-400"
      disabled={isDisabled}
    >
      <div
        className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-300 ${
          isActive ? "bg-blue-100 text-blue-500" : "text-gray-700"
        } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {icon}
        {title}
      </div>
    </button>
  );
};

export default SidebarButton;
