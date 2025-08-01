import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Schema for updating a location (all fields optional for partial updates)
const updateLocationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(100).optional(),
  description: z.string().min(1, "Description is required").max(500).optional(),
  productId: z.string().min(1, "Product ID is required").optional(),
  zone: z.string().min(1, "Zone is required").max(50).optional(),
  section: z.string().min(1, "Section is required").max(50).optional(),
  aisle: z.string().optional(),
  shelf: z.string().optional(),
  position: z
    .object({
      x: z.number().min(0, "X position must be positive"),
      y: z.number().min(0, "Y position must be positive"),
    })
    .optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(200).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("✏️ [LOCATIONS] Updating location");

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

    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = updateLocationSchema.parse(body);

    console.log("👤 [LOCATIONS] User ID:", userId);
    console.log("🆔 [LOCATIONS] Location ID:", locationId);
    console.log("📝 [LOCATIONS] Update data:", validatedData);

    const db = getFirestore();

    // Get existing location
    const locationRef = db.collection("locations").doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: "Location not found",
      });
    }

    const existingLocation = locationDoc.data();
    if (!existingLocation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Location data not found",
      });
    }

    // Verify ownership
    if (existingLocation.sellerId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Location does not belong to this user",
      });
    }

    // If productId is being updated, verify the new product exists and belongs to the user
    if (
      validatedData.productId &&
      validatedData.productId !== existingLocation.productId
    ) {
      const productRef = db.collection("products").doc(validatedData.productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw createError({
          statusCode: 404,
          statusMessage: "Product not found",
        });
      }

      const productData = productDoc.data();
      if (productData?.sellerId !== userId) {
        throw createError({
          statusCode: 403,
          statusMessage: "Product does not belong to this user",
        });
      }

      console.log("✅ [LOCATIONS] New product verification passed");
    }

    // If name is being updated, check for uniqueness
    if (validatedData.name && validatedData.name !== existingLocation.name) {
      const existingLocationQuery = await db
        .collection("locations")
        .where("sellerId", "==", userId)
        .where("name", "==", validatedData.name)
        .get();

      if (!existingLocationQuery.empty) {
        throw createError({
          statusCode: 409,
          statusMessage: "Location name already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Update location
    await locationRef.update(updateData);

    // Get updated location
    const updatedLocationDoc = await locationRef.get();
    const updatedLocation = {
      id: updatedLocationDoc.id,
      ...updatedLocationDoc.data(),
    };

    console.log("✅ [LOCATIONS] Location updated successfully:", locationId);

    return {
      location: updatedLocation,
      message: "Location updated successfully",
    };
  } catch (error) {
    console.error("💥 [LOCATIONS] Error updating location:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid location data",
      });
    }

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error updating location",
    });
  }
});
