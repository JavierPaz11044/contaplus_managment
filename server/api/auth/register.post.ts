import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  telephone: string;
  // Company data
  companyName: string;
  companyRuc: string;
  companyCorporateEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyIndustry: string;
}

export default defineEventHandler(async (event) => {
  console.log("🚀 [REGISTER] Starting seller registration process");

  const body = await readBody<RegisterBody>(event);
  const {
    email,
    password,
    firstName,
    lastName,
    telephone,
    companyName,
    companyRuc,
    companyCorporateEmail,
    companyPhone,
    companyAddress,
    companyIndustry,
  } = body;

  console.log("📝 [REGISTER] Registration data received:", {
    email,
    firstName,
    lastName,
    telephone,
    companyName,
    companyRuc,
    companyCorporateEmail,
    companyPhone,
    companyIndustry,
    // Don't log password and address for security/privacy
  });

  const auth = getAuth();
  const db = getFirestore();

  try {
    // Check if user already exists
    console.log(
      "🔍 [REGISTER] Checking if user already exists with email:",
      email
    );
    await auth.getUserByEmail(email);
    // If the above line doesn't throw, the user exists.
    console.log("❌ [REGISTER] User already exists with email:", email);
    throw new Error("An account with this email already exists.");
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    // If user does not exist, 'auth/user-not-found' will be thrown, which is what we want.
    // We proceed with creating the user only if the error code is 'auth/user-not-found'.
    if (firebaseError.code === "auth/user-not-found") {
      console.log(
        "✅ [REGISTER] User does not exist, proceeding with registration"
      );
      try {
        console.log("👤 [REGISTER] Creating Firebase user account...");
        const userRecord = await auth.createUser({
          email,
          password,
        });

        console.log(
          "✅ [REGISTER] Firebase user created with UID:",
          userRecord.uid
        );

        // Create company document first
        console.log("🏢 [REGISTER] Creating company document...");
        const companyRef = db.collection("companies").doc();
        const companyId = companyRef.id;
        console.log("📝 [REGISTER] Generated company ID:", companyId);

        const companyData = {
          name: companyName,
          ruc: companyRuc,
          corporateEmail: companyCorporateEmail,
          phone: companyPhone,
          address: companyAddress,
          industry: companyIndustry,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          ownerId: userRecord.uid, // Reference to the user who owns this company
        };

        console.log("💾 [REGISTER] Attempting to write company document...");
        console.log("📋 [REGISTER] Company data:", companyData);

        try {
          await companyRef.set(companyData);
          console.log(
            "✅ [REGISTER] Company write operation completed successfully"
          );
        } catch (companyWriteError: unknown) {
          console.error(
            "💥 [REGISTER] FAILED TO WRITE COMPANY - Error details:",
            companyWriteError
          );
          const error = companyWriteError as {
            code?: string;
            message?: string;
          };
          console.error("💥 [REGISTER] Error code:", error?.code);
          console.error("💥 [REGISTER] Error message:", error?.message);
          throw companyWriteError;
        }
        console.log("✅ [REGISTER] Company document created successfully:", {
          companyId,
          companyName,
          companyRuc,
          ownerId: userRecord.uid,
        });

        // Create user document with seller role and company reference
        console.log("📄 [REGISTER] Creating user document in Firestore...");
        await db.collection("users").doc(userRecord.uid).set({
          firstName,
          lastName,
          telephone,
          email,
          role: "seller",
          companyId: companyId, // Reference to the company
          isActive: true,
          isEmailVerified: false,
          isPhoneVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("✅ [REGISTER] User document created successfully:", {
          uid: userRecord.uid,
          email,
          role: "seller",
          companyId,
        });

        console.log("🎉 [REGISTER] Registration completed successfully!");
        return {
          message: "Seller registered successfully",
          uid: userRecord.uid,
          companyId: companyId,
        };
      } catch (creationError: unknown) {
        console.error(
          "💥 [REGISTER] Error during user/company creation:",
          creationError
        );
        const creationFirebaseError = creationError as { message?: string };
        // Handle potential errors during user creation
        throw createError({
          statusCode: 400,
          statusMessage:
            creationFirebaseError.message ||
            "An unexpected error occurred during registration.",
        });
      }
    } else {
      // Handle other errors from getUserByEmail, such as an invalid email format.
      console.error(
        "⚠️ [REGISTER] Unexpected error during user check:",
        firebaseError
      );
      throw createError({
        statusCode: 400,
        statusMessage: firebaseError.message || "An unexpected error occurred.",
      });
    }
  }
});
