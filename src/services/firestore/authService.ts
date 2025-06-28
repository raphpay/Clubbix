import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
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

export const updateUserEmail = async (
  newEmail: string,
  password?: string
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user");
  }

  try {
    await updateEmail(currentUser, newEmail);
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      throw new Error(
        "Email update requires recent authentication. Please log out and log back in to update your email."
      );
    }
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already in use by another account.");
    }
    throw error;
  }
};
