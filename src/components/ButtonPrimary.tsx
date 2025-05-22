type ButtonPrimaryProps = {
  title?: string;
  action?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

const ButtonPrimary = ({
  title,
  action,
  disabled,
  children,
}: ButtonPrimaryProps) => {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled ?? false}
      className="bg-blue-500 text-white px-6 py-3 rounded-md transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {children ?? title}
    </button>
  );
};

export default ButtonPrimary;
