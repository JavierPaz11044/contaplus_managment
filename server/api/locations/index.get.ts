import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Query schema for filtering and pagination
const locationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  productId: z.string().optional(),
  search: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("🗺️ [LOCATIONS] Fetching locations list");

    // Validate query parameters
    const query = getQuery(event);
    const validatedQuery = locationQuerySchema.parse(query);

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

    console.log("👤 [LOCATIONS] User ID:", userId);
    console.log("🔍 [LOCATIONS] Query filters:", {
      page,
      limit,
      isActive,
      productId,
      search,
    });

    const db = getFirestore();
    let locationsQuery = db
      .collection("locations")
      .where("sellerId", "==", userId);

    // Apply filters
    if (isActive !== undefined) {
      locationsQuery = locationsQuery.where("isActive", "==", isActive);
    }

    if (productId) {
      locationsQuery = locationsQuery.where("productId", "==", productId);
    }

    // Get total count for pagination
    const totalSnapshot = await locationsQuery.get();
    const total = totalSnapshot.size;

    // Apply pagination
    const snapshot = await locationsQuery
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const locations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Apply client-side search if provided
    let filteredLocations = locations;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLocations = locations.filter(
        (location) =>
          location.name?.toLowerCase().includes(searchLower) ||
          location.description?.toLowerCase().includes(searchLower) ||
          location.zone?.toLowerCase().includes(searchLower) ||
          location.section?.toLowerCase().includes(searchLower)
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

    console.log("✅ [LOCATIONS] Locations loaded:", filteredLocations.length);
    console.log("📊 [LOCATIONS] Pagination:", pagination);

    return {
      locations: filteredLocations,
      pagination,
    };
  } catch (error) {
    console.error("💥 [LOCATIONS] Error fetching locations:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching locations",
    });
  }
});
