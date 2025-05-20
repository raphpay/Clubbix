import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  type DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

class FirestoreService<T extends DocumentData> {
  private collectionRef: CollectionReference<T>;

  constructor(collectionPath: string) {
    this.collectionRef = collection(
      db,
      collectionPath
    ) as CollectionReference<T>;
  }

  // Create or overwrite a document
  async create(id: string, data: T): Promise<void> {
    const ref = doc(this.collectionRef, id) as DocumentReference<T>;
    await setDoc(ref, data);
  }

  // Read a single document
  async read(id: string): Promise<T | null> {
    const ref = doc(this.collectionRef, id) as DocumentReference<T>;
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as T) : null;
  }

  // Read all documents in the collection
  async readAll(): Promise<T[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => doc.data());
  }

  async findByField<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T | null> {
    const q = query(this.collectionRef, where(field as string, "==", value));
    const snapshot = await getDocs(q);
    const docSnap = snapshot.docs[0];
    return docSnap ? ({ id: docSnap.id, ...docSnap.data() } as T) : null;
  }

  // Update a document with partial data
  async update(id: string, data: Partial<T>): Promise<void> {
    const ref = doc(this.collectionRef, id) as DocumentReference<T>;
    await updateDoc(ref, data);
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const ref = doc(this.collectionRef, id) as DocumentReference<T>;
    await deleteDoc(ref);
  }

  // Generate a new document ID (useful for UI-side creation)
  generateId(): string {
    return doc(this.collectionRef).id;
  }
}

export default FirestoreService;

// Example usage
// import FirestoreService from "@/lib/firestoreService";
// const clubService = new FirestoreService<Club>("clubs");

// await clubService.create(newClub.id, newClub);
