import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Schema for creating a location
const createLocationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  productId: z.string().min(1, "Product ID is required"),
  zone: z.string().min(1, "Zone is required").max(50),
  section: z.string().min(1, "Section is required").max(50),
  aisle: z.string().optional(),
  shelf: z.string().optional(),
  position: z.object({
    x: z.number().min(0, "X position must be positive"),
    y: z.number().min(0, "Y position must be positive"),
  }),
  isActive: z.boolean().default(true),
  notes: z.string().max(200).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("➕ [LOCATIONS] Creating new location");

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
    const validatedData = createLocationSchema.parse(body);

    console.log("👤 [LOCATIONS] User ID:", userId);
    console.log("📝 [LOCATIONS] Location data:", validatedData);

    const db = getFirestore();

    // Verify that the product exists and belongs to the user
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

    console.log("✅ [LOCATIONS] Product verification passed");

    // Check if location name is unique for this seller
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

    // Create location document
    const locationData = {
      ...validatedData,
      sellerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const locationRef = await db.collection("locations").add(locationData);
    const newLocationDoc = await locationRef.get();

    const newLocation = {
      id: newLocationDoc.id,
      ...newLocationDoc.data(),
    };

    console.log(
      "✅ [LOCATIONS] Location created successfully:",
      newLocation.id
    );
    console.log("📄 [LOCATIONS] Location data:", newLocation);

    return {
      location: newLocation,
      message: "Location created successfully",
    };
  } catch (error) {
    console.error("💥 [LOCATIONS] Error creating location:", error);

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
      statusMessage: "Error creating location",
    });
  }
});
