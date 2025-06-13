import React from "react";

type LabelInputProps = {
  label: string;
  value: string;
  errors: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
};

const LabelInput = ({
  label,
  value,
  errors,
  onChange,
  type = "text",
}: LabelInputProps) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
      />
      {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}
    </div>
  );
};

export default LabelInput;
