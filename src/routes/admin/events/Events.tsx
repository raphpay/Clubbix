import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import ButtonPrimary from "../../../components/ButtonPrimary";
import EventModal from "../../../components/modals/EventModal";
import { db } from "../../../lib/firebase";
import type { Event } from "../../../types/Event";
import ModalRole from "../../../types/enums/ModalRole";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalRole, setModalRole] = useState<ModalRole | undefined>(undefined);

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  function displayModal(event?: Event) {
    setShowModal(true);
    setSelectedEvent(event);
    if (event) setModalRole(ModalRole.modify);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedEvent(undefined);
    setModalRole(undefined);
  }

  async function loadEvents() {
    try {
      const snapshot = await getDocs(collection(db, "clubs", clubId, "events"));
      const docs = snapshot.docs;
      let apiEvents: Event[] = [];
      for (const doc of docs) {
        let event = doc.data() as Event;
        event.id = doc.id;
        apiEvents.push(event);
      }
      setEvents(apiEvents);
    } catch (error) {
      console.log("Error loading members");
    }
  }

  useEffect(() => {
    async function init() {
      loadEvents();
    }
    init();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Liste d'évènements</h1>
        <ButtonPrimary
          title={"+ Ajouter un évènement"}
          action={() => displayModal()}
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-sm text-texte-secondaire">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Localisation</th>
              <th className="px-4 py-3">Max de participants</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.map((event, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-secondary">
                  {event.title}
                </td>
                <td className="px-4 py-3">
                  {new Date(event.date).toLocaleString()}
                </td>
                <td className="px-4 py-3">{event.location}</td>
                <td className="px-4 py-3">{event.maxParticipants}</td>
                <td className="px-4 py-3">
                  {event.published ? "Publié" : "Brouillon"}
                </td>
                <td>
                  <button
                    onClick={() => displayModal(event)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Voir / Modifier →
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Aucun évènement de prévu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EventModal
        event={selectedEvent}
        show={showModal}
        onClose={closeModal}
        onSubmit={loadEvents}
        modalRole={modalRole}
      />
    </div>
  );
};

export default Events;
