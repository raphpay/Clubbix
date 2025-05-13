import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import { db } from "../../lib/firebase";
import type { Event } from "../../types/Event";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  function displayModal() {
    setShowModal(true);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "clubs", clubId, "events"));
      const docs = snapshot.docs;
      let apiEvents: Event[] = [];
      for (const doc of docs) {
        let event = doc.data() as Event;
        event.id = doc.id;
        apiEvents.push(event);
      }
      setEvents(apiEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Liste d'évènements</h1>
        <ButtonPrimary title={"+ Ajouter un évènement"} action={displayModal} />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-sm text-texte-secondaire">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Date</th>
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
                <td className="px-4 py-3">{event.maxParticipants}</td>
                <td className="px-4 py-3">
                  {event.published ? "Publié" : "Brouillon"}
                </td>
                <td>
                  <button
                    onClick={() => displayModal()}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Voir / Modifier →
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Aucun évènement de prévu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
