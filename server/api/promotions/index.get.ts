import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Query schema for filtering and pagination
const promotionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  productId: z.string().optional(),
  search: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("🎯 [PROMOTIONS] Fetching promotions list");

    // Validate query parameters
    const query = getQuery(event);
    const validatedQuery = promotionQuerySchema.parse(query);

    const { page, limit, isActive, productId, search } = validatedQuery;
    const offset = (page - 1) * limit;

    // Get user ID from context (set by auth middleware)
    const userId = event.context.userId;
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not authenticated",
      });
    }

    console.log("👤 [PROMOTIONS] User ID:", userId);
    console.log("🔍 [PROMOTIONS] Query filters:", {
      page,
      limit,
      isActive,
      productId,
      search,
    });

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

    // Get total count for pagination
    const totalSnapshot = await promotionsQuery.get();
    const total = totalSnapshot.size;

    // Apply pagination
    const snapshot = await promotionsQuery
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const promotions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Apply client-side search if provided
    let filteredPromotions = promotions;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPromotions = promotions.filter(
        (promotion) =>
          promotion.title?.toLowerCase().includes(searchLower) ||
          promotion.message?.toLowerCase().includes(searchLower) ||
          promotion.description?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };

    console.log(
      "✅ [PROMOTIONS] Promotions loaded:",
      filteredPromotions.length
    );
    console.log("📊 [PROMOTIONS] Pagination:", pagination);

    return {
      promotions: filteredPromotions,
      pagination,
    };
  } catch (error) {
    console.error("💥 [PROMOTIONS] Error fetching promotions:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching promotions",
    });
  }
});
