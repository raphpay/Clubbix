type InputProps = {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  onChange: (e: any) => void;
  required?: boolean;
};

const Input = ({
  label,
  value,
  type,
  placeholder,
  onChange,
  required = false,
}: InputProps) => {
  return (
    <div className="w-full text-left">
      <label className="text-gray-500">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
};

export default Input;
