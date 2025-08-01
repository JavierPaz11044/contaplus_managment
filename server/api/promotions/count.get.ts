import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Query schema for statistics filters
const countQuerySchema = z.object({
  isActive: z.coerce.boolean().optional(),
  productId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("📊 [PROMOTIONS] Fetching promotion statistics");

    // Validate query parameters
    const query = getQuery(event);
    const validatedQuery = countQuerySchema.parse(query);

    const { isActive, productId } = validatedQuery;

    // Get user ID from context
    const userId = event.context.userId;
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not authenticated",
      });
    }

    console.log("👤 [PROMOTIONS] User ID:", userId);
    console.log("🔍 [PROMOTIONS] Statistics filters:", { isActive, productId });

    const db = getFirestore();
    let promotionsQuery = db
      .collection("promotions")
      .where("sellerId", "==", userId);

    // Apply filters
    if (isActive !== undefined) {
      promotionsQuery = promotionsQuery.where("isActive", "==", isActive);
    }

    if (productId) {
      promotionsQuery = promotionsQuery.where("productId", "==", productId);
    }

    // Get all promotions for statistics
    const snapshot = await promotionsQuery.get();
    const promotions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Calculate statistics
    const total = promotions.length;
    const active = promotions.filter((promo) => promo.isActive).length;
    const inactive = total - active;

    // Calculate date-based statistics
    const now = new Date();
    const current = promotions.filter((promo) => {
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      return startDate <= now && endDate >= now;
    }).length;

    const upcoming = promotions.filter((promo) => {
      const startDate = new Date(promo.startDate);
      return startDate > now;
    }).length;

    const expired = promotions.filter((promo) => {
      const endDate = new Date(promo.endDate);
      return endDate < now;
    }).length;

    // Count by discount type
    const discountTypes = {
      percentage: promotions.filter(
        (promo) => promo.discountType === "percentage"
      ).length,
      fixed: promotions.filter((promo) => promo.discountType === "fixed")
        .length,
      free_shipping: promotions.filter(
        (promo) => promo.discountType === "free_shipping"
      ).length,
    };

    // Calculate usage statistics
    const totalUses = promotions.reduce(
      (sum, promo) => sum + (promo.currentUses || 0),
      0
    );
    const totalMaxUses = promotions.reduce(
      (sum, promo) => sum + (promo.maxUses || 0),
      0
    );
    const usageRate = totalMaxUses > 0 ? (totalUses / totalMaxUses) * 100 : 0;

    // Count products with promotions
    const productsWithPromotions = new Set(
      promotions.map((promo) => promo.productId).filter(Boolean)
    );

    // Calculate average discount value
    const avgDiscountValue =
      promotions.length > 0
        ? promotions.reduce(
            (sum, promo) => sum + (promo.discountValue || 0),
            0
          ) / promotions.length
        : 0;

    const statistics = {
      count: total,
      total,
      active,
      inactive,
      current,
      upcoming,
      expired,
      totalUses,
      totalMaxUses,
      usageRate,
      avgDiscountValue,
      productsWithPromotions: productsWithPromotions.size,
      discountTypes,
      healthScore: {
        activeRatio: total > 0 ? (active / total) * 100 : 0,
        currentRatio: total > 0 ? (current / total) * 100 : 0,
        usageRatio: usageRate,
      },
    };

    console.log("✅ [PROMOTIONS] Statistics calculated:", statistics);

    return {
      statistics,
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error fetching statistics:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching promotion statistics",
    });
  }
});
