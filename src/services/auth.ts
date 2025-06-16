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

export type UserRole = "member" | "admin";

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please use a different email or try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password (at least 6 characters).";
    case "auth/user-not-found":
      return "No account found with this email. Please check your email or sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    default:
      return "An error occurred. Please try again.";
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
  return userDoc.data() as User;
};
