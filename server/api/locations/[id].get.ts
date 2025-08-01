import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔍 [LOCATIONS] Fetching single location");

    // Get location ID from router params
    const locationId = getRouterParam(event, "id");
    if (!locationId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Location ID is required",
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

    console.log("👤 [LOCATIONS] User ID:", userId);
    console.log("🆔 [LOCATIONS] Location ID:", locationId);

    const db = getFirestore();
    const locationRef = db.collection("locations").doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: "Location not found",
      });
    }

    const locationData = locationDoc.data();

    // Verify ownership
    if (locationData?.sellerId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Location does not belong to this user",
      });
    }

    const location = {
      id: locationDoc.id,
      ...locationData,
    };

    console.log("✅ [LOCATIONS] Location loaded:", locationId);

    return {
      location,
    };
  } catch (error) {
    console.error("💥 [LOCATIONS] Error fetching location:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching location",
    });
  }
});
