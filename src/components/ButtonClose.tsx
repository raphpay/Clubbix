type ButtonCloseProps = {
  title: string;
  action: () => void;
  disabled?: boolean;
};

const ButtonClose = ({ title, action, disabled }: ButtonCloseProps) => {
  return (
    <button
      onClick={action}
      disabled={disabled ?? false}
      className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-500 transition"
    >
      {title}
    </button>
  );
};

export default ButtonClose;
