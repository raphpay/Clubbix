import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

import type { Training } from "../../types/Training";
import ModalRole from "../../types/enums/ModalRole";

import ButtonClose from "../ButtonClose";
import ButtonDanger from "../ButtonDanger";
import ButtonPrimary from "../ButtonPrimary";

type TrainingModalProps = {
  training?: Training;
  show: boolean;
  modalRole: ModalRole;
  onClose: () => void;
  onSubmit: () => void;
};

const TrainingModal = ({
  training,
  show,
  modalRole,
  onClose,
  onSubmit,
}: TrainingModalProps) => {
  const [type, setType] = useState<string>("");
  const [coach, setCoach] = useState<string>("");
  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTraining();
    onClose();
  };

  async function saveTraining() {}

  async function eraseTraining(training?: Training) {
    try {
      if (training?.id) {
        await deleteDoc(doc(db, "clubs", clubId, "trainings", training.id));
        onClose();
        onSubmit();
      }
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  }

  useEffect(() => {
    if (training) {
      setType(training.type);
      setCoach(training.coach);
    }
  }, [training]);

  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/75 transition-opacity">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-secondary">
              {training ? "Modifier le membre" : "Ajouter un membre"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Coach
                  </label>
                  <input
                    type="text"
                    name="coach"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end space-x-2">
              <ButtonClose action={onClose} title={"Fermer"} />
              {modalRole === ModalRole.modify && (
                <ButtonDanger
                  title={"Effacer"}
                  action={() => eraseTraining(training)}
                />
              )}
              <ButtonPrimary title={"Sauvegarder"} action={saveTraining} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TrainingModal;
