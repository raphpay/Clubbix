import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    }
    if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Too many password reset requests. Please wait before requesting another reset."
      );
    }
    if (error.code === "auth/operation-not-allowed") {
      throw new Error("Password reset is not enabled for this account");
    }
    throw new Error("Failed to send password reset email. Please try again.");
  }
};

export const updateUserEmail = async (newEmail: string): Promise<void> => {
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

export const sendEmailVerificationLink = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user");
  }

  try {
    await sendEmailVerification(currentUser);
  } catch (error: any) {
    if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Too many verification requests. Please wait before requesting another verification email."
      );
    }
    throw error;
  }
};
