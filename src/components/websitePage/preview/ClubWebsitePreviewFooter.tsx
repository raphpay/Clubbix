import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsitePreviewFooter = () => {
  const { email, phone } = useClubWebsiteStore();

  return (
    <footer className="text-sm text-white pb-6 bg-gray-400 flex flex-col py-2">
      <div className="flex flex-col justify-center">
        {email && <p>Email de contact: {email}</p>}
        {phone && <p>Numéro de contact: {phone}</p>}
      </div>
      © {new Date().getFullYear()} Clubbix. Tous droits réservés.
    </footer>
  );
};

export default ClubWebsitePreviewFooter;
