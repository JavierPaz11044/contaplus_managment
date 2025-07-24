import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Company schema for including company data in session
const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  ruc: z.string(),
  corporateEmail: z.string(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

const userSchema = z.object({
  id: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().default(false),
  role: z.enum(["seller", "client"]).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  companyId: z.string().optional().nullable(),
  company: companySchema.optional().nullable(),
});

export default defineEventHandler(async (event) => {
  console.log("🔐 [SESSION] Starting user session creation");

  try {
    const contextUser = event.context.user;
    console.log("📋 [SESSION] Context user:", {
      uid: contextUser?.uid,
      email: contextUser?.email,
      emailVerified: contextUser?.email_verified,
    });

    if (!contextUser?.uid) {
      console.error("❌ [SESSION] No user UID found in context");
      throw createError({
        statusCode: 401,
        statusMessage: "No user authentication context found",
      });
    }

    const db = getFirestore();
    console.log("🔍 [SESSION] Fetching user data for UID:", contextUser.uid);

    const user = await db.collection("users").doc(contextUser.uid).get();

    if (!user.exists) {
      console.error(
        "❌ [SESSION] User document not found for UID:",
        contextUser.uid
      );
      throw createError({
        statusCode: 404,
        statusMessage: "User not found in database",
      });
    }

    const userFormat = user.data();
    console.log("👤 [SESSION] User data retrieved:", {
      id: user.id,
      email: userFormat?.email,
      role: userFormat?.role,
      isActive: userFormat?.isActive,
      hasCompanyId: !!userFormat?.companyId,
    });

    // Get company data if user is a seller
    let companyData = null;
    if (userFormat?.role === "seller" && userFormat?.companyId) {
      console.log(
        "🏢 [SESSION] Fetching company data for company ID:",
        userFormat.companyId
      );

      try {
        const companyDoc = await db
          .collection("companies")
          .doc(userFormat.companyId)
          .get();

        if (companyDoc.exists) {
          const companyInfo = companyDoc.data();
          companyData = {
            id: companyDoc.id,
            name: companyInfo?.name,
            ruc: companyInfo?.ruc,
            corporateEmail: companyInfo?.corporateEmail,
            phone: companyInfo?.phone || null,
            address: companyInfo?.address || null,
            industry: companyInfo?.industry || null,
            isActive: companyInfo?.isActive === true,
          };
          console.log("✅ [SESSION] Company data retrieved:", {
            id: companyData.id,
            name: companyData.name,
            ruc: companyData.ruc,
            isActive: companyData.isActive,
          });
        } else {
          console.warn(
            "⚠️ [SESSION] Company document not found for ID:",
            userFormat.companyId
          );
        }
      } catch (companyError) {
        console.error(
          "❌ [SESSION] Error fetching company data:",
          companyError
        );
        // Continue without company data rather than failing
      }
    } else {
      console.log(
        "ℹ️ [SESSION] No company data needed - user role:",
        userFormat?.role
      );
    }

    console.log("🔄 [SESSION] Parsing and validating user data");

    const userData = userSchema.parse({
      ...user.data(),
      id: user.id,
      role:
        userFormat?.role === "client" || userFormat?.role === "seller"
          ? userFormat?.role
          : null,
      isActive: userFormat?.isActive === true,
      companyId: userFormat?.companyId || null,
      company: companyData,
    });

    console.log("✅ [SESSION] User data validated successfully:", {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      isActive: userData.isActive,
      hasCompany: !!userData.company,
    });

    console.log("💾 [SESSION] Setting user session");
    console.log("📄 [SESSION] Session data to be saved:", {
      userId: userData.id,
      userRole: userData.role,
      isActive: userData.isActive,
      companyId: userData.companyId,
      hasCompany: !!userData.company,
    });

    try {
      await setUserSession(event, { user: userData });
      console.log("✅ [SESSION] setUserSession completed successfully");
    } catch (sessionError: unknown) {
      const error = sessionError as Error;
      console.error("❌ [SESSION] Error in setUserSession:", {
        message: error.message || "Unknown error",
        stack: error.stack || "No stack trace",
        name: error.name || "Unknown error type",
      });
      throw sessionError;
    }

    console.log(
      "🎉 [SESSION] Session created successfully for user:",
      userData.id
    );

    return {
      user: userData,
    };
  } catch (error) {
    console.error("💥 [SESSION] Error during session creation:", error);

    // Log specific error details
    if (error instanceof z.ZodError) {
      console.error("📋 [SESSION] Validation error details:", error.errors);
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid user data format",
      });
    }

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Generic error fallback
    console.error("🔥 [SESSION] Unexpected error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during session creation",
    });
  }
});
