import { useContext } from "react";
import { ClubContext } from "../contexts/ClubContext";

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
};
