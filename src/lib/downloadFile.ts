import { getBlob, getStorage, ref } from "firebase/storage";

export async function downloadFile(
  path: string,
  fileName: string
): Promise<File> {
  const storage = getStorage();
  const fileRef = ref(storage, path); // e.g. "clubs/clubId/logo.jpg"
  const blob = await getBlob(fileRef);
  return new File([blob], fileName, { type: blob.type });
}
