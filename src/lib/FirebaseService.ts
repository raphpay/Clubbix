import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  type DocumentData,
  type UpdateData,
} from "firebase/firestore";
import { db } from "./firebase";

// Exemple usage
// import FirestoreService from '@/lib/firestoreService';
// import type { Member } from '@/types/member';

// const memberService = new FirestoreService<Member>('clubs/clubId/members');

// // Example: create a new member
// await memberService.create('memberId123', {
//   fullName: 'Louis Dupont',
//   email: 'louis@example.com',
//   role: 'rider',
// });

// Generic service to manage any collection
class FirestoreService<T extends DocumentData> {
  private collectionRef: CollectionReference<T>;

  constructor(collectionPath: string) {
    this.collectionRef = collection(
      db,
      collectionPath
    ) as CollectionReference<T>;
  }

  async create(id: string, data: T): Promise<void> {
    await setDoc(doc(this.collectionRef, id), data);
  }

  async read(id: string): Promise<T | null> {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  async readAll(): Promise<T[]> {
    const querySnap = await getDocs(this.collectionRef);
    return querySnap.docs.map((doc) => doc.data());
  }

  async update(id: string, data: UpdateData<T>): Promise<void> {
    await updateDoc(
      doc(this.collectionRef, id) as DocumentReference<T, T>,
      data
    );
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, id));
  }

  generateId(): string {
    return doc(this.collectionRef).id;
  }
}

export default FirestoreService;
