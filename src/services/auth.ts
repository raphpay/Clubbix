import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface AuthErrorResponse {
  code: string;
  message: string;
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  clubId: string;
  firstName: string;
  lastName: string;
  createdAt: Timestamp;
}

export type UserRole =
  | "admin"
  | "treasurer"
  | "rider"
  | "coach"
  | "parent"
  | "member";

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "email-already-in-use";
    case "auth/invalid-email":
      return "invalid-email";
    case "auth/operation-not-allowed":
      return "operation-not-allowed";
    case "auth/weak-password":
      return "weak-password";
    case "auth/user-not-found":
      return "user-not-found";
    case "auth/wrong-password":
      return "wrong-password";
    default:
      return "default";
  }
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    throw error as AuthError;
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    throw error as AuthError;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
};

// TODO: Remove this function
export const getUserRole = async (
  userId: string
): Promise<"admin" | "member"> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  return userDoc.data().role;
};

export const getUser = async (userId: string): Promise<User> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  const userData = userDoc.data();
  return {
    ...userData,
    uid: userId,
  } as User;
};
