import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔍 [PROMOTIONS] Fetching single promotion");

    // Get promotion ID from router params
    const promotionId = getRouterParam(event, "id");
    if (!promotionId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Promotion ID is required",
      });
    }

    // Get user ID from context
    const userId = event.context.userId;
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not authenticated",
      });
    }

    console.log("👤 [PROMOTIONS] User ID:", userId);
    console.log("🆔 [PROMOTIONS] Promotion ID:", promotionId);

    const db = getFirestore();
    const promotionRef = db.collection("promotions").doc(promotionId);
    const promotionDoc = await promotionRef.get();

    if (!promotionDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion not found",
      });
    }

    const promotionData = promotionDoc.data();

    // Verify ownership
    if (promotionData?.sellerId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Promotion does not belong to this user",
      });
    }

    const promotion = {
      id: promotionDoc.id,
      ...promotionData,
    };

    console.log("✅ [PROMOTIONS] Promotion loaded:", promotionId);

    return {
      promotion,
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error fetching promotion:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching promotion",
    });
  }
});
