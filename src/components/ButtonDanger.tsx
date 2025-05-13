type ButtonDangerProps = {
  title: string;
  action: () => void;
  disabled?: boolean;
};

const ButtonDanger = ({ title, action, disabled }: ButtonDangerProps) => {
  return (
    <button
      onClick={action}
      disabled={disabled ?? false}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
    >
      {title}
    </button>
  );
};

export default ButtonDanger;
