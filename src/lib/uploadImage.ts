import { getStorage, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file: File, path: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, path); // e.g., 'clubs/clubId/logo.jpg'

  await uploadBytes(storageRef, file);
  // await getDownloadURL(storageRef);
  // return url; // ✅ Save this to Firestore
};
