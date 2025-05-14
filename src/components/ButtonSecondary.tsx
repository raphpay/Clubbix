type ButtonSecondaryProps = {
  title: string;
  action: () => void;
  disabled?: boolean;
};

const ButtonSecondary = ({ title, action, disabled }: ButtonSecondaryProps) => {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled ?? false}
      className="bg-white text-blue-500 px-4 py-2 border-blue-500 border-1 rounded-md hover:bg-blue-100 transition"
    >
      {title}
    </button>
  );
};

export default ButtonSecondary;
