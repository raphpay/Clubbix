import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

import ButtonClose from "../../../components/ButtonClose";
import ButtonDanger from "../../../components/ButtonDanger";
import ButtonPrimary from "../../../components/ButtonPrimary";
import Input from "../../../components/Input";
import NumberInput from "../../../components/inputs/NumberInput";
import FirestoreService from "../../../lib/FirebaseService";
import { useClubStore } from "../../../stores/useClubStore";
import {
  TreasuryStatus,
  TreasuryType,
  type Treasury,
  type TreasuryUpdateInput,
} from "../../../types/Treasury";

type FinanceEntryModalProps = {
  entry?: Treasury;
  show: boolean;
  displayErase: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const FinanceEntryModal = ({
  entry,
  show,
  displayErase,
  onClose,
  onSubmit,
}: FinanceEntryModalProps) => {
  const { currentClubId } = useClubStore();

  const treasuryCollection = new FirestoreService<Treasury>(
    `clubs/${currentClubId}/treasury`
  );

  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<TreasuryType>(TreasuryType.expense);
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<TreasuryStatus>(TreasuryStatus.paid);
  const [category, setCategory] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(new Date().toDateString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEntry();
    onClose();
  };

  async function saveEntry() {
    if (entry) {
      await updateEntry();
    } else {
      await createEntry();
    }
  }

  async function updateEntry() {
    if (currentClubId && entry) {
      try {
        const updatedEntry: TreasuryUpdateInput = {
          label,
          amount,
          category,
          status,
          date: Timestamp.fromDate(new Date(entryDate)),
        };
        await treasuryCollection.update(entry.id, updatedEntry);
        resetFields();
        onClose();
        onSubmit();
      } catch (error) {}
    }
  }

  async function createEntry() {
    if (currentClubId) {
      try {
        const id = treasuryCollection.generateId();
        const newEntry: Treasury = {
          id,
          type,
          label,
          amount,
          category,
          status,
          date: Timestamp.fromDate(new Date(entryDate)),
          createdAt: Timestamp.fromDate(new Date()),
          clubId: currentClubId,
        };
        await treasuryCollection.create(id, newEntry);
        resetFields();
        onClose();
        onSubmit();
      } catch (error) {}
    }
  }

  function resetFields() {
    setLabel("");
    setAmount(0);
    setCategory("");
    setStatus(TreasuryStatus.paid);
    setEntryDate(new Date().toDateString());
  }

  async function eraseEntry(entry?: Treasury) {
    if (currentClubId && entry) {
      try {
        await treasuryCollection.delete(entry.id);
        onClose();
        onSubmit();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  }

  useEffect(() => {
    if (entry) {
      setLabel(entry.label);
      setType(entry.type);
      setAmount(entry.amount);
      setEntryDate(
        entry.date instanceof Timestamp
          ? entry.date.toDate().toISOString().slice(0, 16)
          : typeof entry.date === "string"
          ? new Date(entry.date).toISOString().slice(0, 16)
          : ""
      );
      setCategory(entry.category);
      setStatus(entry.status);
    }
  }, [entry]);

  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/75 transition-opacity">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-secondary">
              {entry ? "Modifier l'entrée" : "Ajouter une entrée"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Description"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Achat de trophées"
                  required={true}
                />
                <NumberInput
                  label="Montant"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1500"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="p-3 border border-gray-300 rounded-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TreasuryStatus)}
                  required
                >
                  <option value="paid">Payé</option>
                  <option value="unpaid">Non payé</option>
                </select>
                <Input
                  label="Catégorie"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Compétition"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Date et heure
                  </label>
                  <input
                    type="datetime-local"
                    name="entryDate"
                    value={entryDate}
                    defaultValue={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <select
                  className="p-3 border border-gray-300 rounded-md"
                  value={type}
                  onChange={(e) => setType(e.target.value as TreasuryType)}
                  required
                >
                  <option value="expense">Dépense</option>
                  <option value="revenue">Revenu</option>
                </select>
              </div>
            </form>
            <div className="flex justify-end space-x-2">
              <ButtonClose action={onClose} title={"Fermer"} />
              {displayErase && (
                <ButtonDanger
                  title={"Effacer"}
                  action={() => eraseEntry(entry)}
                />
              )}
              <ButtonPrimary title={"Sauvegarder"} action={saveEntry} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FinanceEntryModal;
