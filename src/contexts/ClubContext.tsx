import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { ClubData } from "../services/firestore/types/club";

interface Club {
  id: string;
  name: string;
}

interface ClubContextType {
  club: ClubData | null;
  loading: boolean;
}

export const ClubContext = createContext<ClubContextType>({
  club: null,
  loading: true,
});

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClub(null);
      setLoading(false);
      return;
    }

    const clubId = user.clubId; // Assuming this is stored in the user object
    if (!clubId) {
      setClub(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "clubs", clubId),
      (doc) => {
        if (doc.exists()) {
          setClub({ id: doc.id, ...(doc.data() as ClubData) });
        } else {
          setClub(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching club:", error);
        setClub(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <ClubContext.Provider value={{ club, loading }}>
      {!loading && children}
    </ClubContext.Provider>
  );
};
