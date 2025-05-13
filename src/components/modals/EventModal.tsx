import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

import type { Event } from "../../types/Event";

import ModalRole from "../../types/enums/ModalRole";
import ButtonClose from "../ButtonClose";
import ButtonDanger from "../ButtonDanger";
import ButtonPrimary from "../ButtonPrimary";

type EventModalProps = {
  event?: Event;
  show: boolean;
  modalRole?: ModalRole;
  onClose: () => void;
  onSubmit: () => void;
};

const EventModal = ({
  event,
  show,
  modalRole,
  onClose,
  onSubmit,
}: EventModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEvent();
    onClose();
  };

  async function modifyEvent() {
    if (!event?.id) return;

    const updatedEvent: Event = {
      title,
      description,
      date,
      location,
      type,
      maxParticipants: +maxParticipants,
      published,
    };

    try {
      await setDoc(doc(db, "clubs", clubId, "events", event.id), updatedEvent);
      onClose();
      onSubmit();
    } catch (error) {
      console.error("Error modifying event:", error);
    }
  }

  async function createEvent() {
    const date = new Date().toDateString();
    try {
      const maxPart: number = +maxParticipants;
      const newEvent: Event = {
        title,
        description,
        date,
        location,
        type,
        maxParticipants: maxPart,
        published,
      };
      await addDoc(collection(db, "clubs", clubId, "events"), newEvent);
      onClose();
      onSubmit();
    } catch (error) {}
  }

  async function saveEvent() {
    if (modalRole === ModalRole.create) {
      await createEvent();
    } else {
      await modifyEvent();
    }
  }

  async function eraseEvent(event?: Event) {
    try {
      if (event?.id) {
        await deleteDoc(doc(db, "clubs", clubId, "events", event.id));
        onClose();
        onSubmit();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setLocation(event.location);
      setType(event.type);
      setMaxParticipants(event.maxParticipants.toString());
      setPublished(event.published);
    }
  }, [event]);

  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/75 transition-opacity">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-secondary">
              {event ? "Modifier le membre" : "Ajouter un membre"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Nombre de participants maximum
                  </label>
                  <input
                    type="text"
                    name="maxParticipants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    name="published"
                    checked={published}
                    onClick={() => setPublished(!published)}
                    onChange={() => {}}
                    className="accent-blue-500 w-5 h-5"
                  />
                  <label className="text-sm text-texte-secondaire">
                    Publié
                  </label>
                </div>
              </div>
            </form>
            <div className="flex justify-end space-x-2">
              <ButtonClose action={onClose} title={"Fermer"} />
              {modalRole === ModalRole.modify && (
                <ButtonDanger
                  title={"Effacer"}
                  action={() => eraseEvent(event)}
                />
              )}
              <ButtonPrimary title={"Sauvegarder"} action={saveEvent} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EventModal;
