import {
  AuthError,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface AuthErrorResponse {
  code: string;
  message: string;
}

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
    default:
      return "An error occurred during registration. Please try again.";
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
