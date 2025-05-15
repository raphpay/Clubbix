import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { db } from "../../../lib/firebase";

import ButtonPrimary from "../../../components/ButtonPrimary";
import TrainingModal from "../../../components/modals/TrainingModal";

import { collection, getDocs } from "firebase/firestore";
import type { Training } from "../../../types/Training";
import ModalRole from "../../../types/enums/ModalRole";

const Trainings = () => {
  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: Load dynamically

  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTraining, setSelectedTraining] = useState<
    Training | undefined
  >(undefined);
  const [modalRole, setModalRole] = useState<ModalRole>(ModalRole.create);

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

  const {
    data: trainings = [],
    isLoading,
    isError,
  } = useQuery<Training[]>({
    queryKey: ["trainings", clubId],
    queryFn: async () => {
      const snapshot = await getDocs(
        collection(db, "clubs", clubId, "trainings")
      );
      return snapshot.docs.map((doc) => ({
        ...(doc.data() as Training),
        id: doc.id,
      }));
    },
  });

  const calendarEvents = trainings.map((training) => ({
    id: training.id,
    title: `${training.type} - ${training.coach}`,
    start: training.dateTimeStart.toDate(),
    end: new Date(
      training.dateTimeStart.toDate().getTime() + training.durationInMin * 60000
    ),
    color: trainingColors[getBaseCategory(training.type)] || "#6B7280",
  }));

  function displayModal(
    training?: Training,
    modalRole: ModalRole = ModalRole.create
  ) {
    setShowModal(true);
    setSelectedTraining(training);
    setModalRole(modalRole);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedTraining(undefined);
    setModalRole(ModalRole.create);
  }

  if (isLoading) return <div className="p-6">Chargement...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Erreur lors du chargement.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          Planning des séances
        </h1>
        <ButtonPrimary
          title={"+ Ajouter un entrainement"}
          action={displayModal}
        />
      </div>

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
          eventClick={(info) => {
            const trainingId = info.event.id;
            const training = trainings.find((t) => t.id === trainingId);
            if (training) {
              displayModal(training, ModalRole.modify);
            }
          }}
        />
      </div>

      <TrainingModal
        training={selectedTraining}
        show={showModal}
        modalRole={modalRole}
        onClose={closeModal}
        onSubmit={() => {
          queryClient.invalidateQueries({ queryKey: ["trainings", clubId] });
        }}
      />
    </div>
  );
};

export default Trainings;
