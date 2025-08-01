import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Schema for updating a promotion (all fields optional for partial updates)
const updatePromotionSchema = z.object({
  title: z.string().min(1, "Promotion title is required").max(100).optional(),
  description: z.string().min(1, "Description is required").max(500).optional(),
  message: z.string().min(1, "Message is required").max(200).optional(),
  productId: z.string().min(1, "Product ID is required").optional(),
  discountType: z.enum(["percentage", "fixed", "free_shipping"]).optional(),
  discountValue: z
    .number()
    .min(0, "Discount value must be positive")
    .optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().min(1, "End date is required").optional(),
  isActive: z.boolean().optional(),
  maxUses: z.number().min(1, "Max uses must be at least 1").optional(),
  conditions: z.string().max(300).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("✏️ [PROMOTIONS] Updating promotion");

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

    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = updatePromotionSchema.parse(body);

    console.log("👤 [PROMOTIONS] User ID:", userId);
    console.log("🆔 [PROMOTIONS] Promotion ID:", promotionId);
    console.log("📝 [PROMOTIONS] Update data:", validatedData);

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

    const existingPromotion = promotionDoc.data();
    if (!existingPromotion) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion data not found",
      });
    }

    // Verify ownership
    if (existingPromotion.sellerId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Promotion does not belong to this user",
      });
    }

    // If productId is being updated, verify the new product exists and belongs to the user
    if (
      validatedData.productId &&
      validatedData.productId !== existingPromotion.productId
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

      console.log("✅ [PROMOTIONS] New product verification passed");
    }

    // If title is being updated, check for uniqueness
    if (
      validatedData.title &&
      validatedData.title !== existingPromotion.title
    ) {
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
    }

    // Validate dates if being updated
    if (validatedData.startDate || validatedData.endDate) {
      const startDate = validatedData.startDate
        ? new Date(validatedData.startDate)
        : new Date(existingPromotion.startDate);
      const endDate = validatedData.endDate
        ? new Date(validatedData.endDate)
        : new Date(existingPromotion.endDate);

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
    }

    // Prepare update data
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Update promotion
    await promotionRef.update(updateData);

    // Get updated promotion
    const updatedPromotionDoc = await promotionRef.get();
    const updatedPromotion = {
      id: updatedPromotionDoc.id,
      ...updatedPromotionDoc.data(),
    };

    console.log("✅ [PROMOTIONS] Promotion updated successfully:", promotionId);

    return {
      promotion: updatedPromotion,
      message: "Promotion updated successfully",
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error updating promotion:", error);

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
      statusMessage: "Error updating promotion",
    });
  }
});
