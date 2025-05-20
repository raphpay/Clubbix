// File: src/lib/storageService.ts
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

class StorageService {
  private storage = getStorage();

  /**
   * Upload a file to a specific path in Firebase Storage
   * @param path - Full path like `clubs/clubId/logo.jpg`
   * @param file - File object to upload
   * @returns Promise<string> - The full path where the file is stored
   */
  async upload(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return path;
  }

  /**
   * Get a download URL from a given storage path
   * @param path - Full path to the file
   * @returns Promise<string> - Publicly accessible download URL
   */
  async getDownloadUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return await getDownloadURL(storageRef);
  }

  /**
   * Delete a file from Firebase Storage
   * @param path - Full path to the file
   * @returns Promise<void>
   */
  async delete(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }
}

export default new StorageService();

// Example usage
// import storageService from "@/lib/storageService";

// await storageService.upload("clubs/clubId/logo.jpg", file);
// const url = await storageService.getDownloadUrl("clubs/clubId/logo.jpg");
