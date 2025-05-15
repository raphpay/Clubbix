import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  strength?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
}

export default function PasswordInput({
  placeholder,
  value,
  strength,
  setValue,
  errorMessage,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />
      <button
        type="button"
        className="absolute top-3 right-3 flex items-center text-gray-500"
        onClick={() => setVisible((v) => !v)}
        aria-label="Afficher le mot de passe"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {errorMessage ? (
        <p className="text-sm mt-1 text-red-600">{errorMessage}</p>
      ) : strength ? (
        <p
          className={`text-sm mt-1 ${
            strength === "Fort"
              ? "text-green-600"
              : strength === "Moyen"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          Sécurité : {strength}
        </p>
      ) : null}
    </div>
  );
}
