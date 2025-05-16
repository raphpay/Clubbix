import ButtonPrimary from "../../components/ButtonPrimary";
import { useWebsitePageStore } from "../../stores/useWebsitePageStore";
import ClubWebsitePageForm from "./ClubWebsitePageForm";
import ClubWebsitePagePreview from "./ClubWebsitePagePreview";

const ClubConfiguration = () => {
  const { isEditing, setIsEditing } = useWebsitePageStore((state) => state);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Start section switch */}
      <section className="flex justify-center items-center gap-4 pb-6">
        Mode : {isEditing ? "Edition" : "Preview"}
        <ButtonPrimary
          title={isEditing ? "Preview" : "Editer"}
          action={() => setIsEditing(!isEditing)}
        />
      </section>
      {/* End section switch */}

      {isEditing ? <ClubWebsitePageForm /> : <ClubWebsitePagePreview />}
    </div>
  );
};
export default ClubConfiguration;
