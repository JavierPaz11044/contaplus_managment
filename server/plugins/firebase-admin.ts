// server/plugins/firebase-admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";

export default defineNitroPlugin(async () => {
  if (!getApps().length) {
    console.log(
      "🔧 [FIREBASE-ADMIN] Starting Firebase Admin initialization..."
    );

    // Check if required environment variables are present
    const requiredEnvVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    };

    console.log("🔍 [FIREBASE-ADMIN] Checking environment variables:");
    let hasAllVars = true;

    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (value) {
        console.log(`✅ [FIREBASE-ADMIN] ${key}: Present`);
        if (key === "FIREBASE_PRIVATE_KEY") {
          console.log(
            `🔑 [FIREBASE-ADMIN] Private key length: ${value.length} chars`
          );
          console.log(
            `🔑 [FIREBASE-ADMIN] Private key starts with: ${value.substring(
              0,
              27
            )}`
          );
        }
      } else {
        console.error(`❌ [FIREBASE-ADMIN] ${key}: Missing`);
        hasAllVars = false;
      }
    });

    if (!hasAllVars) {
      console.error(
        "💥 [FIREBASE-ADMIN] Missing required environment variables"
      );
      return;
    }

    // Process private key
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!;

    // More robust private key processing
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
      console.log(
        "🔑 [FIREBASE-ADMIN] Private key: Escaped newlines converted"
      );
    }

    // Validate private key format
    if (
      !privateKey.includes("BEGIN PRIVATE KEY") ||
      !privateKey.includes("END PRIVATE KEY")
    ) {
      console.error("💥 [FIREBASE-ADMIN] Private key format appears invalid");
      return;
    }

    try {
      const adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: privateKey,
        }),
        // Solo incluir databaseURL si usas Realtime Database
        ...(process.env.FIREBASE_DATABASE_URL && {
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        }),
        // Storage bucket es opcional para Firestore
        ...(process.env.FIREBASE_STORAGE_BUCKET && {
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        }),
      });

      console.log(
        "✅ [FIREBASE-ADMIN] Firebase Admin initialized successfully"
      );
      console.log(
        `🎯 [FIREBASE-ADMIN] Project ID: ${process.env.FIREBASE_PROJECT_ID}`
      );
      console.log(
        `🎯 [FIREBASE-ADMIN] Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`
      );

      // Test Firebase Admin permissions
      try {
        const { getFirestore } = await import("firebase-admin/firestore");
        const db = getFirestore(adminApp);
        const _testDoc = await db
          .collection("_permission_test")
          .doc("test")
          .get();
        console.log("✅ [FIREBASE-ADMIN] Firestore permissions: Working");
      } catch (permissionError) {
        console.error(
          "❌ [FIREBASE-ADMIN] Firestore permissions failed:",
          permissionError
        );
        const error = permissionError as { code?: string; message?: string };
        if (error.code === "permission-denied") {
          console.error(
            "🔒 [FIREBASE-ADMIN] PERMISSION DENIED - Check Firestore rules or service account permissions"
          );
        }
      }
    } catch (error: unknown) {
      console.error("💥 [FIREBASE-ADMIN] Failed to initialize Firebase Admin:");

      const firebaseError = error as { message?: string; code?: string };
      console.error(
        "💥 [FIREBASE-ADMIN] Error message:",
        firebaseError.message
      );
      console.error("💥 [FIREBASE-ADMIN] Error code:", firebaseError.code);

      // Specific error handling
      if (firebaseError.message?.includes("private_key")) {
        console.error(
          "🔑 [FIREBASE-ADMIN] Private key format error - check your .env file"
        );
      }
      if (firebaseError.message?.includes("client_email")) {
        console.error(
          "📧 [FIREBASE-ADMIN] Client email error - verify service account email"
        );
      }
      if (firebaseError.message?.includes("project_id")) {
        console.error(
          "🆔 [FIREBASE-ADMIN] Project ID error - verify Firebase project ID"
        );
      }
    }
  } else {
    console.log("ℹ️ [FIREBASE-ADMIN] Firebase Admin already initialized");
  }
});
