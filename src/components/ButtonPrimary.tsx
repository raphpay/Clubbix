type ButtonPrimaryProps = {
  title: string;
  action: () => void;
  disabled?: boolean;
};

const ButtonPrimary = ({ title, action, disabled }: ButtonPrimaryProps) => {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled ?? false}
      className="bg-blue-500 text-white px-4 py-2 rounded-md transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {title}
    </button>
  );
};

export default ButtonPrimary;
