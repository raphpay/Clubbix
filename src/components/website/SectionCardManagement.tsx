import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteCard as deleteCardFS,
  deleteSection as deleteSectionFS,
  getSections,
  reorderSections,
  saveCard,
  saveSection,
  uploadCardImage,
} from "../../services/firestore/clubWebsiteService";
import { ClubWebsiteSection } from "../../services/firestore/types/clubWebsite";
import Alert from "../common/Alert";

interface SectionCardManagerProps {
  websiteId: string;
}

type ModalType =
  | null
  | "add-section"
  | "edit-section"
  | "add-card"
  | "edit-card";

type ModalState = {
  type: ModalType;
  sectionId?: string;
  cardId?: string;
};

const SectionCardManager: React.FC<SectionCardManagerProps> = ({
  websiteId,
}) => {
  const { t } = useTranslation("website");
  const [sections, setSections] = useState<ClubWebsiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modal, setModal] = useState<ModalState>({ type: null });
  // Form state for modal
  const [form, setForm] = useState<{ [key: string]: string }>({});

  // Card image file state
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");

  // Fetch sections on mount
  useEffect(() => {
    if (!websiteId) return;
    setLoading(true);
    getSections(websiteId)
      .then((data) => {
        console.log("data", data);
        setSections(data);
      })
      .catch((err) => setError("Failed to load sections"))
      .finally(() => setLoading(false));
  }, [websiteId]);

  // --- Section Handlers ---
  const openAddSection = () => {
    setForm({ title: "", description: "" });
    setModal({ type: "add-section" });
  };

  const openEditSection = (section: ClubWebsiteSection) => {
    setForm({ title: section.title, description: section.description });
    setModal({ type: "edit-section", sectionId: section.id });
  };

  const handleSectionModalConfirm = async () => {
    setLoading(true);
    try {
      if (modal.type === "add-section") {
        await saveSection(websiteId, {
          title: form.title,
          description: form.description,
          order: sections.length + 1,
          cards: [],
        });
      } else if (modal.type === "edit-section" && modal.sectionId) {
        const section = sections.find((s) => s.id === modal.sectionId);
        if (!section) throw new Error(t("section.error.notFound"));
        await saveSection(websiteId, {
          ...section,
          title: form.title,
          description: form.description,
        });
      }
      setSections(await getSections(websiteId));
      setModal({ type: null });
    } catch (err) {
      setError(t("section.error.save"));
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (id: string) => {
    if (!window.confirm(t("section.confirm.delete"))) return;
    setLoading(true);
    try {
      await deleteSectionFS(websiteId, id);
      setSections(await getSections(websiteId));
    } catch (err) {
      setError(t("section.error.delete"));
    } finally {
      setLoading(false);
    }
  };

  const moveSection = async (id: string, direction: "up" | "down") => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const arr = [...sections];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    // Update order in Firestore
    setSections(arr.map((s, i) => ({ ...s, order: i + 1 })));
    setLoading(true);
    try {
      await reorderSections(
        websiteId,
        arr.map((s) => s.id)
      );
      setSections(await getSections(websiteId));
    } catch (err) {
      setError(t("section.error.reorder"));
    } finally {
      setLoading(false);
    }
  };

  // --- Card Handlers ---
  const openAddCard = (section: ClubWebsiteSection) => {
    setForm({ title: "", body: "" });
    setCardImageFile(null);
    setCardImagePreview("");
    setModal({ type: "add-card", sectionId: section.id });
  };

  const openEditCard = (section: ClubWebsiteSection, cardId: string) => {
    const card = section.cards.find((c) => c.id === cardId);
    setForm({
      title: card?.title || "",
      body: card?.body || "",
    });
    setCardImageFile(null);
    setCardImagePreview(card?.imageUrl || "");
    setModal({ type: "edit-card", sectionId: section.id, cardId });
  };

  const handleCardModalConfirm = async () => {
    setLoading(true);
    try {
      let imageUrl = form.imageUrl || "";
      // If a new file is selected, upload it
      if (cardImageFile && modal.sectionId) {
        imageUrl = await uploadCardImage(
          websiteId,
          modal.sectionId,
          cardImageFile
        );
      }
      if (modal.type === "add-card" && modal.sectionId) {
        const section = sections.find((s) => s.id === modal.sectionId);
        if (!section) throw new Error(t("section.error.notFound"));
        await saveCard(websiteId, modal.sectionId, {
          title: form.title,
          body: form.body,
          imageUrl,
          order: (section.cards?.length || 0) + 1,
        });
      } else if (
        modal.type === "edit-card" &&
        modal.sectionId &&
        modal.cardId
      ) {
        const section = sections.find((s) => s.id === modal.sectionId);
        if (!section) throw new Error(t("section.error.notFound"));
        const card = section.cards.find((c) => c.id === modal.cardId);
        if (!card) throw new Error(t("card.error.notFound"));
        await saveCard(websiteId, modal.sectionId, {
          ...card,
          title: form.title,
          body: form.body,
          imageUrl,
        });
      }
      setSections(await getSections(websiteId));
      setModal({ type: null });
      setCardImageFile(null);
      setCardImagePreview("");
    } catch (err) {
      setError(t("card.error.save"));
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (sectionId: string, cardId: string) => {
    if (!window.confirm(t("card.confirm.delete"))) return;
    setLoading(true);
    try {
      await deleteCardFS(websiteId, sectionId, cardId);
      setSections(await getSections(websiteId));
    } catch (err) {
      setError(t("card.error.delete"));
    } finally {
      setLoading(false);
    }
  };

  const moveCard = async (
    sectionId: string,
    cardId: string,
    direction: "up" | "down"
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const idx = section.cards.findIndex((c) => c.id === cardId);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= section.cards.length) return;
    const arr = [...section.cards];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    // Update order in Firestore
    setLoading(true);
    try {
      for (let i = 0; i < arr.length; i++) {
        await saveCard(websiteId, sectionId, { ...arr[i], order: i + 1 });
      }
      setSections(await getSections(websiteId));
    } catch (err) {
      setError(t("card.error.reorder"));
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Field Configs ---
  const sectionFields = [
    {
      label: t("section.title"),
      value: form.title || "",
      onChange: (v: string) => setForm((f) => ({ ...f, title: v })),
      type: "text",
      placeholder: t("section.titlePlaceholder"),
    },
    {
      label: t("section.description"),
      value: form.description || "",
      onChange: (v: string) => setForm((f) => ({ ...f, description: v })),
      type: "text",
      placeholder: t("section.descriptionPlaceholder"),
    },
  ];
  const cardFields = [
    {
      label: t("card.title"),
      value: form.title || "",
      onChange: (v: string) => setForm((f) => ({ ...f, title: v })),
      type: "text",
      placeholder: t("card.titlePlaceholder"),
      required: true,
    },
    {
      label: t("card.body"),
      value: form.body || "",
      onChange: (v: string) => setForm((f) => ({ ...f, body: v })),
      type: "text",
      placeholder: t("card.bodyPlaceholder"),
      required: true,
    },
    {
      label: t("card.image"),
      value: "",
      onChange: () => {}, // not used for file
      type: "file",
      onFileChange: (file: File | null) => {
        setCardImageFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) =>
            setCardImagePreview(e.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setCardImagePreview("");
        }
      },
      filePreviewUrl: cardImagePreview,
      required: false,
    },
  ];

  if (loading) return <div>{t("section.loading")}</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold dark:text-gray-100">
          {t("section.pageTitle")}
        </h3>
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={openAddSection}
        >
          {t("section.add")}
        </button>
      </div>
      <div className="space-y-6">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, sIdx) => (
            <div
              key={section.id}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-lg font-bold dark:text-gray-100">
                    {section.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {section.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveSection(section.id, "up")}
                    disabled={sIdx === 0}
                    title={t("section.moveUp")}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveSection(section.id, "down")}
                    disabled={sIdx === sections.length - 1}
                    title={t("section.moveDown")}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => openEditSection(section)}
                    className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                  >
                    {t("section.buttons.edit")}
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                  >
                    {t("section.buttons.delete")}
                  </button>
                </div>
              </div>
              {/* Cards for this section */}
              <div className="ml-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold dark:text-gray-200">
                    {t("card.pageTitle")}
                  </span>
                  <button
                    onClick={() => openAddCard(section)}
                    className="px-2 py-1 bg-indigo-100 rounded hover:bg-indigo-200"
                  >
                    {t("card.add")}
                  </button>
                </div>
                <div className="space-y-2">
                  {section.cards.length === 0 && (
                    <div className="text-gray-400 italic">
                      {t("card.noCards")}
                    </div>
                  )}
                  {section.cards
                    .sort((a, b) => a.order - b.order)
                    .map((card, cIdx) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 border rounded p-2 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex-1">
                          <div className="font-medium dark:text-gray-100">
                            {card.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {card.body}
                          </div>
                          {card.imageUrl && (
                            <img
                              src={card.imageUrl}
                              alt="card"
                              className="mt-1 h-16 rounded"
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCard(section.id, card.id, "up")}
                            disabled={cIdx === 0}
                            title={t("section.moveUp")}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() =>
                              moveCard(section.id, card.id, "down")
                            }
                            disabled={cIdx === section.cards.length - 1}
                            title={t("section.moveDown")}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => openEditCard(section, card.id)}
                            className="px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200"
                          >
                            {t("section.buttons.edit")}
                          </button>
                          <button
                            onClick={() => deleteCard(section.id, card.id)}
                            className="px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                          >
                            {t("section.buttons.delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Alert Modals */}
      <Alert
        open={modal.type === "add-section" || modal.type === "edit-section"}
        onClose={() => setModal({ type: null })}
        onConfirm={handleSectionModalConfirm}
        title={
          modal.type === "add-section"
            ? t("section.alert.addTitle")
            : t("section.alert.editTitle")
        }
        fields={sectionFields}
        confirmText={
          modal.type === "add-section"
            ? t("section.add")
            : t("section.buttons.save")
        }
        cancelText={t("section.buttons.cancel")}
        loading={loading}
      />
      <Alert
        open={modal.type === "add-card" || modal.type === "edit-card"}
        onClose={() => setModal({ type: null })}
        onConfirm={handleCardModalConfirm}
        title={
          modal.type === "add-card"
            ? t("card.alert.addTitle")
            : t("card.alert.editTitle")
        }
        fields={cardFields}
        confirmText={
          modal.type === "add-card" ? t("card.add") : t("section.buttons.save")
        }
        cancelText={t("section.buttons.cancel")}
        loading={loading}
      />
    </div>
  );
};

export default SectionCardManager;
