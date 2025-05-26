type NumberInputProps = {
  label: string;
  value: number;
  canBeNegative?: boolean;
  placeholder: string;
  onChange: (e: any) => void;
  required?: boolean;
};

const NumberInput = ({
  label,
  value,
  placeholder,
  onChange,
  required = false,
  canBeNegative = false,
}: NumberInputProps) => {
  return (
    <div className="w-full text-left">
      <label className="text-gray-500">{label}</label>
      <input
        type={"number"}
        min={canBeNegative ? "-1000000" : "0"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
};

export default NumberInput;
