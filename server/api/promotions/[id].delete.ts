import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  try {
    console.log("🗑️ [PROMOTIONS] Deleting promotion");

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

    // Get existing promotion
    const promotionRef = db.collection("promotions").doc(promotionId);
    const promotionDoc = await promotionRef.get();

    if (!promotionDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion not found",
      });
    }

    const promotionData = promotionDoc.data();
    if (!promotionData) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion data not found",
      });
    }

    // Verify ownership
    if (promotionData.sellerId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Promotion does not belong to this user",
      });
    }

    // Delete promotion
    await promotionRef.delete();

    console.log("✅ [PROMOTIONS] Promotion deleted successfully:", promotionId);

    return {
      message: "Promotion deleted successfully",
      deletedPromotion: {
        id: promotionId,
        title: promotionData.title,
        productId: promotionData.productId,
      },
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error deleting promotion:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error deleting promotion",
    });
  }
});
