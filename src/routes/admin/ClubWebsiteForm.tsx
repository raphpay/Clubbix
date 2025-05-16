import { Bike, Dumbbell, Mountain, PersonStanding } from "lucide-react";
import Input from "../../components/Input";
import { useClubWebsiteStore } from "../../stores/useClubWebsiteStore";
import type { Activity } from "../../types/WebsitePage";

const availableIcons: { name: string; Icon: typeof Bike }[] = [
  { name: "bike", Icon: Bike },
  { name: "fitness", Icon: Dumbbell },
  { name: "mountain", Icon: Mountain },
  { name: "community", Icon: PersonStanding },
];

const ClubWebsiteForm = () => {
  const {
    clubName,
    setClubName,
    logoUrl,
    setLogoUrl,
    heroTitle,
    setHeroTitle,
    heroDescription,
    setHeroDescription,
    heroImageUrl,
    setHeroImageUrl,
    setLogoFile,
    setHeroImageFile,
    email,
    setEmail,
    phone,
    setPhone,
    instagramLink,
    setInstagramLink,
    facebookLink,
    setFacebookLink,
    activities,
    setActivities,
  } = useClubWebsiteStore();

  const handleActivityChange = (
    index: number,
    field: "title" | "description" | "icon",
    value: string
  ) => {
    const newActivities = [...activities];
    newActivities[index][field] = value;
    console.log(
      newActivities[index][field],
      index,
      field,
      newActivities[index][field]
    );
    setActivities(newActivities);
  };

  function addActivity() {
    const newActivity: Activity = {
      icon: "bike",
      title: "",
      description: "",
    };
    console.log("new", [...activities, newActivity]);
    setActivities([...activities, newActivity]);
  }

  function removeNavLink(index: number) {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Modifier le site du club</h2>

      {/* Club Name */}
      <div>
        <label className="block font-semibold">Nom du Club</label>
        <input
          type="text"
          value={clubName ?? ""}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Logo URL */}
      <div>
        <label className="block font-semibold mb-1">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setLogoFile(file);
            const url = URL.createObjectURL(file);
            setLogoUrl(url); // Update Zustand
          }}
          className="w-full border rounded px-3 py-2"
        />
        {logoUrl && (
          <img src={logoUrl} alt="" className="mt-2 h-16 object-contain" />
        )}
      </div>

      {/* Activities */}
      <div>
        <label className="block font-semibold mb-2">Activités du club</label>
        {activities.map((activity, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 items-center"
          >
            <div className="flex items-center gap-2">
              <select
                value={activity.icon}
                onChange={(e) =>
                  handleActivityChange(index, "icon", e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                {availableIcons.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {(() => {
                const SelectedIcon = availableIcons.find(
                  (i) => i.name === activity.icon
                )?.Icon;
                return SelectedIcon ? (
                  <SelectedIcon className="w-4 h-4 text-blue-600" />
                ) : null;
              })()}
            </div>
            <input
              type="text"
              value={activity.title}
              onChange={(e) =>
                handleActivityChange(index, "title", e.target.value)
              }
              placeholder="BMX Race"
              className="flex-1 border px-2 py-1 rounded"
            />
            <input
              type="text"
              value={activity.description}
              onChange={(e) =>
                handleActivityChange(index, "description", e.target.value)
              }
              placeholder="Des cours de BMX Race pour tous"
              className="flex-1 border px-2 py-1 rounded"
            />
            <button
              onClick={() => removeNavLink(index)}
              className="text-red-600 px-2"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addActivity}
          disabled={activities.length >= 3}
          className="mt-2 text-sm text-blue-600 underline disabled:text-gray-500"
        >
          + Ajouter une activité ( 3 max )
        </button>
      </div>

      {/* Hero Title */}
      <div>
        <label className="block font-semibold">
          Titre de la bannière principale
        </label>
        <input
          type="text"
          value={heroTitle ?? ""}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Hero Description */}
      <div>
        <label className="block font-semibold">
          Description de la bannière principale
        </label>
        <textarea
          value={heroDescription ?? ""}
          onChange={(e) => setHeroDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
        />
      </div>

      {/* Hero Background Image */}
      <div>
        <label className="block font-semibold">
          Image de fond de la bannière principale
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setHeroImageFile(file);
            const url = URL.createObjectURL(file);
            setHeroImageUrl(url); // Update Zustand
          }}
          className="w-full border rounded px-3 py-2"
        />
        {heroImageUrl && (
          <img src={heroImageUrl} alt="" className="mt-2 h-16 object-contain" />
        )}
      </div>

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

export default ClubWebsiteForm;
