import { toast } from "react-toastify";
import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

type ClipboardButtonProps = {
  type: "email" | "phone";
  value: string | null;
};

const ClubWebsitePreviewFooter = () => {
  const { email, phone } = useClubWebsiteStore();

  const ClipboardButton = ({ type, value }: ClipboardButtonProps) => {
    function copyToClipboard() {
      if (type === "email") {
        navigator.clipboard.writeText(value ?? "Pas d'email");
        toast.success("Email copié");
      } else {
        navigator.clipboard.writeText(value ?? "Pas de numéro de téléphone");
        toast.success("Numéro copié");
      }
    }

    return (
      <button
        onClick={copyToClipboard}
        className="cursor-pointer underline ml-2"
      >
        {value}
      </button>
    );
  };

  return (
    <footer className="text-sm text-white pb-6 bg-gray-400 flex flex-col py-2">
      <div className="flex flex-col justify-center">
        {email && (
          <p>
            Email de contact:
            <ClipboardButton type="email" value={email} />
          </p>
        )}
        {phone && (
          <p>
            Numéro de contact:
            <ClipboardButton type="phone" value={phone} />
          </p>
        )}
      </div>
      © {new Date().getFullYear()} Clubbix. Tous droits réservés.
    </footer>
  );
};

export default ClubWebsitePreviewFooter;
