import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Select, { type OnChangeValue } from "react-select";
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

type GroupOption = {
  id: string;
  value: string;
  label: string;
};

type TypeOption = {
  value: string;
  label: string;
};

const typeOptions: TypeOption[] = [
  { value: "BMX", label: "BMX" },
  { value: "VTT", label: "VTT" },
  { value: "Stage", label: "Stage" },
  { value: "Autre", label: "Autre" },
];

const TrainingModal = ({
  training,
  show,
  modalRole,
  onClose,
  onSubmit,
}: TrainingModalProps) => {
  const [type, setType] = useState<TypeOption>(typeOptions[0]);
  const [coach, setCoach] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  // Set default dateTimeStart to today at 18:00
  const getTodayAt6PM = () => {
    const todayAt6PM = new Date();
    todayAt6PM.setHours(18, 0, 0, 0);
    return todayAt6PM.toISOString().slice(0, 16);
  };
  const [dateTimeStart, setDateTimeStart] = useState<string>(getTodayAt6PM());
  const [durationInMin, setDurationInMin] = useState<number>(60);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [availableGroups, setAvailableGroups] = useState<GroupOption[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<readonly GroupOption[]>(
    []
  );

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTraining();
  };

  const onGroupSelectChange = (newValue: OnChangeValue<GroupOption, true>) => {
    setSelectedGroups(newValue as readonly GroupOption[]);
  };

  async function modifyTraining() {
    if (!training?.id) return;
    console.log("modify");

    const updatedTraining: Training = {
      type: type.label,
      coach,
      notes: "notes",
      dateTimeStart: Timestamp.fromDate(new Date(dateTimeStart)),
      durationInMin,
      cancelled,
      groupIds: selectedGroups.map((group) => group.id),
      recurrence: {
        frequency: "none",
      },
    };

    try {
      await setDoc(
        doc(db, "clubs", clubId, "trainings", training.id),
        updatedTraining
      );

      onClose();
      onSubmit();
    } catch (error) {
      console.error("Error modifying training:", error);
    }
  }

  async function createTraining() {
    try {
      console.log("create");
      if (!dateTimeStart) return;
      // Using as unknown as Timestamp, since the form provides string
      const training: Training = {
        type: type.label,
        coach,
        notes: "",
        dateTimeStart: Timestamp.fromDate(new Date(dateTimeStart)),
        durationInMin,
        cancelled,
        groupIds: selectedGroups.map((group) => group.id),
        recurrence: {
          frequency: "none",
        },
      };

      await addDoc(collection(db, "clubs", clubId, "trainings"), training);
      onClose();
      onSubmit();
    } catch (error) {
      console.log("Error creating training:", error);
    }
  }

  async function saveTraining() {
    if (modalRole === ModalRole.modify) {
      await modifyTraining();
    } else {
      await createTraining();
    }
  }

  async function deleteTraining() {
    try {
      if (training?.id) {
        await deleteDoc(doc(db, "clubs", clubId, "trainings", training.id));
        onClose();
        onSubmit();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  async function loadGroups() {
    try {
      const snapshot = await getDocs(collection(db, "clubs", clubId, "groups"));
      const docs = snapshot.docs;
      let groupOptions: GroupOption[] = [];
      let groupIds: string[] = [];
      for (const doc of docs) {
        const data = doc.data();
        groupIds.push(doc.id);
        let groupOption = {
          id: doc.id,
          value: data.name,
          label: data.name,
        };
        groupOptions.push(groupOption);
      }
      setAvailableGroups(groupOptions);
    } catch (error) {
      console.log("Error loading groups", error);
    }
  }

  useEffect(() => {
    if (training) {
      const matchedType = typeOptions.find(
        (opt) => opt.value === training.type
      );
      if (matchedType) setType(matchedType);
      setCoach(training.coach);
      setNotes(training.notes);
      setDateTimeStart(
        training.dateTimeStart instanceof Timestamp
          ? training.dateTimeStart.toDate().toISOString().slice(0, 16)
          : typeof training.dateTimeStart === "string"
          ? new Date(training.dateTimeStart).toISOString().slice(0, 16)
          : ""
      );
      setDurationInMin(training.durationInMin ?? 60);
      setCancelled(training.cancelled ?? false);
    } else {
      // Set dateTimeStart to today at 18:00 when no training is provided
      const todayAt6PM = new Date();
      todayAt6PM.setHours(18, 0, 0, 0);
      setDateTimeStart(todayAt6PM.toISOString().slice(0, 16));
    }
  }, [training]);

  useEffect(() => {
    async function init() {
      loadGroups();
    }
    init();
  }, []);

  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/75 transition-opacity">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-secondary">
              {training ? "Modifier la séance" : "Ajouter une séance"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Type
                  </label>
                  <Select
                    name="type"
                    options={typeOptions}
                    classNamePrefix="select"
                    value={type}
                    onChange={(selected) => setType(selected as TypeOption)}
                    className="basic-multi-select"
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
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Date et heure
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTimeStart"
                    value={dateTimeStart}
                    defaultValue={dateTimeStart}
                    onChange={(e) => setDateTimeStart(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    name="durationInMin"
                    value={durationInMin}
                    onChange={(e) => setDurationInMin(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="cancelled"
                  checked={cancelled}
                  onChange={(e) => setCancelled(e.target.checked)}
                />
                <label className="text-sm text-texte-secondaire">
                  Séance annulée
                </label>
              </div>

              <div>
                <label className="block text-sm text-texte-secondaire mb-1">
                  Groupes
                </label>
                <Select
                  isMulti
                  name="colors"
                  options={availableGroups}
                  classNamePrefix="select"
                  onChange={onGroupSelectChange}
                  value={selectedGroups}
                  className="basic-multi-select"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <ButtonClose action={onClose} title={"Fermer"} />
                {modalRole === ModalRole.modify && (
                  <ButtonDanger title={"Effacer"} action={deleteTraining} />
                )}
                <ButtonPrimary title={"Sauvegarder"} action={saveTraining} />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TrainingModal;
