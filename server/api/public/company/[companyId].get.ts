import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Schema for company ID parameter
const companyIdSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("🏢 [PUBLIC-COMPANY] Starting company info request");

    // Get company ID from URL parameter
    const companyId = getRouterParam(event, "companyId");

    if (!companyId) {
      console.log("❌ [PUBLIC-COMPANY] No company ID provided");
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    console.log("🔍 [PUBLIC-COMPANY] Looking for company:", companyId);

    // Get Firestore instance
    const db = getFirestore();

    // Get company document
    const companyDoc = await db.collection("companies").doc(companyId).get();

    if (!companyDoc.exists) {
      console.log("❌ [PUBLIC-COMPANY] Company not found:", companyId);
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    const companyData = companyDoc.data();

    if (!companyData) {
      console.log("❌ [PUBLIC-COMPANY] Company data is null");
      throw createError({
        statusCode: 404,
        statusMessage: "Company data not found",
      });
    }

    // Get owner user information
    let ownerInfo = null;
    if (companyData.ownerId) {
      try {
        const userDoc = await db
          .collection("users")
          .doc(companyData.ownerId)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          ownerInfo = {
            id: userData?.id,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            telephone: userData?.telephone,
          };
        }
      } catch (error) {
        console.log("⚠️ [PUBLIC-COMPANY] Could not fetch owner info:", error);
      }
    }

    // Prepare response data
    const response = {
      company: {
        id: companyId,
        name: companyData.name,
        ruc: companyData.ruc,
        corporateEmail: companyData.corporateEmail,
        phone: companyData.phone,
        address: companyData.address,
        industry: companyData.industry,
        createdAt: companyData.createdAt,
        updatedAt: companyData.updatedAt,
      },
      owner: ownerInfo,
      stats: {
        totalProducts: 0,
        totalLocations: 0,
        activePromotions: 0,
      },
    };

    // Get basic stats
    try {
      const productsSnapshot = await db
        .collection("products")
        .where("companyId", "==", companyId)
        .get();

      const locationsSnapshot = await db
        .collection("locations")
        .where("companyId", "==", companyId)
        .get();

      const promotionsSnapshot = await db
        .collection("promotions")
        .where("companyId", "==", companyId)
        .where("isActive", "==", true)
        .get();

      response.stats = {
        totalProducts: productsSnapshot.size,
        totalLocations: locationsSnapshot.size,
        activePromotions: promotionsSnapshot.size,
      };
    } catch (error) {
      console.log("⚠️ [PUBLIC-COMPANY] Could not fetch stats:", error);
    }

    console.log(
      "✅ [PUBLIC-COMPANY] Company info retrieved successfully:",
      companyId
    );

    return response;
  } catch (error: unknown) {
    console.error("💥 [PUBLIC-COMPANY] Error:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
