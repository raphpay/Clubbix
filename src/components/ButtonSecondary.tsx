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
      className="bg-white text-blue-600 border-blue-600 border-1 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
    >
      {title}
    </button>
  );
};

export default ButtonSecondary;
