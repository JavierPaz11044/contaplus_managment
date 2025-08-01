import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Schema for creating a promotion
const createPromotionSchema = z.object({
  title: z.string().min(1, "Promotion title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  message: z.string().min(1, "Message is required").max(200),
  productId: z.string().min(1, "Product ID is required"),
  discountType: z.enum(["percentage", "fixed", "free_shipping"]),
  discountValue: z.number().min(0, "Discount value must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true),
  maxUses: z.number().min(1, "Max uses must be at least 1").optional(),
  conditions: z.string().max(300).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("➕ [PROMOTIONS] Creating new promotion");

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
    const validatedData = createPromotionSchema.parse(body);

    console.log("👤 [PROMOTIONS] User ID:", userId);
    console.log("📝 [PROMOTIONS] Promotion data:", validatedData);

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

    console.log("✅ [PROMOTIONS] Product verification passed");

    // Validate dates
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid date format",
      });
    }

    if (startDate >= endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: "End date must be after start date",
      });
    }

    // Check if promotion title is unique for this seller
    const existingPromotionQuery = await db
      .collection("promotions")
      .where("sellerId", "==", userId)
      .where("title", "==", validatedData.title)
      .get();

    if (!existingPromotionQuery.empty) {
      throw createError({
        statusCode: 409,
        statusMessage: "Promotion title already exists",
      });
    }

    // Create promotion document
    const promotionData = {
      ...validatedData,
      sellerId: userId,
      currentUses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const promotionRef = await db.collection("promotions").add(promotionData);
    const newPromotionDoc = await promotionRef.get();

    const newPromotion = {
      id: newPromotionDoc.id,
      ...newPromotionDoc.data(),
    };

    console.log(
      "✅ [PROMOTIONS] Promotion created successfully:",
      newPromotion.id
    );
    console.log("📄 [PROMOTIONS] Promotion data:", newPromotion);

    return {
      promotion: newPromotion,
      message: "Promotion created successfully",
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error creating promotion:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid promotion data",
      });
    }

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error creating promotion",
    });
  }
});
