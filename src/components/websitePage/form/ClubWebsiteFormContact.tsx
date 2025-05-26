import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";
import Input from "../../Input";

const ClubWebsiteFormContact = () => {
  const {
    email,
    phone,
    instagramLink,
    facebookLink,
    setEmail,
    setPhone,
    setInstagramLink,
    setFacebookLink,
  } = useClubWebsiteStore();

  return (
    <div>
      {/* Contact */}
      <label className="block font-semibold">Informations de contact</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email de contact"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@club.com"
          type="email"
        />
        <Input
          label="Numéro de téléphone de contact"
          value={phone ?? ""}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0601 12 34 56"
          type="text"
        />
        <Input
          label="Lien de la page Instagram"
          value={instagramLink ?? ""}
          onChange={(e) => setInstagramLink(e.target.value)}
          placeholder="https://www.instagram/club-test.com"
          type="text"
        />
        <Input
          label="Lien de la page Facebook"
          value={facebookLink ?? ""}
          onChange={(e) => setFacebookLink(e.target.value)}
          placeholder="https://www.facebook/club-test.com"
          type="text"
        />
      </div>
    </div>
  );
};

export default ClubWebsiteFormContact;
