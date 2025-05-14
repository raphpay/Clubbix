import { useState } from "react";
import Header from "../../components/Header";

const ClubConfiguration = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <div className="p-6">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Nom du club
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
    </div>
  );
};
export default ClubConfiguration;
