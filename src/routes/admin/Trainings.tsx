import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import type { Training } from "../../types/Training";

const Trainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  async function loadTrainings() {
    const snapshot = await getDocs(
      collection(db, "clubs", clubId, "trainings")
    );
    let apiTrainings: Training[] = [];
    for (const doc of snapshot.docs) {
      let training = doc.data() as Training;
      training.id = doc.id;
      apiTrainings.push(training);
    }
    setTrainings(apiTrainings);
  }

  useEffect(() => {
    async function init() {
      loadTrainings();
    }
    init();
  }, []);

  const trainingColors: Record<string, string> = {
    BMX: "#3B82F6",
    VTT: "#10B981",
    Stage: "#F59E0B",
  };

  const getBaseCategory = (type: string): string => {
    if (type.toLowerCase().includes("bmx")) return "BMX";
    if (type.toLowerCase().includes("vtt")) return "VTT";
    if (type.toLowerCase().includes("stage")) return "Stage";
    return "Other";
  };

  const calendarEvents = trainings.map((training) => ({
    id: training.id,
    title: `${training.type} - ${training.coach}`,
    start: training.dateTimeStart.toDate(),
    end: new Date(
      training.dateTimeStart.toDate().getTime() + training.durationInMin * 60000
    ),
    color: trainingColors[getBaseCategory(training.type)] || "#6B7280",
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-secondary">
        Planning des séances
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          height="auto"
        />
      </div>

      {/* TODO: Add modal here for create/edit */}
      {/* TODO: Add sortable past trainings table here */}
    </div>
  );
};

export default Trainings;
