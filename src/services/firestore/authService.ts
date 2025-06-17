import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../config/firebase";

export const createAuthUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    }
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("No user found with this email");
    }
    throw error;
  }
};
