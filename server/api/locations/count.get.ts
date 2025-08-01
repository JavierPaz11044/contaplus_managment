import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

// Query schema for statistics filters
const countQuerySchema = z.object({
  isActive: z.coerce.boolean().optional(),
  productId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    console.log("📊 [LOCATIONS] Fetching location statistics");

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

    console.log("👤 [LOCATIONS] User ID:", userId);
    console.log("🔍 [LOCATIONS] Statistics filters:", { isActive, productId });

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

    // Get all locations for statistics
    const snapshot = await locationsQuery.get();
    const locations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Calculate statistics
    const total = locations.length;
    const active = locations.filter((loc) => loc.isActive).length;
    const inactive = total - active;

    // Count unique zones and sections
    const zones = new Set(locations.map((loc) => loc.zone).filter(Boolean));
    const sections = new Set(
      locations.map((loc) => loc.section).filter(Boolean)
    );
    const aisles = new Set(locations.map((loc) => loc.aisle).filter(Boolean));

    // Count products with locations
    const productsWithLocations = new Set(
      locations.map((loc) => loc.productId).filter(Boolean)
    );

    // Calculate coverage metrics
    const totalZones = zones.size;
    const totalSections = sections.size;
    const totalAisles = aisles.size;
    const productsCovered = productsWithLocations.size;

    // Calculate average positions (for map visualization)
    const avgPosition =
      locations.length > 0
        ? {
            x:
              locations.reduce((sum, loc) => sum + (loc.position?.x || 0), 0) /
              locations.length,
            y:
              locations.reduce((sum, loc) => sum + (loc.position?.y || 0), 0) /
              locations.length,
          }
        : { x: 0, y: 0 };

    const statistics = {
      count: total,
      total,
      active,
      inactive,
      totalZones,
      totalSections,
      totalAisles,
      productsCovered,
      avgPosition,
      coverage: {
        zones: Array.from(zones),
        sections: Array.from(sections),
        aisles: Array.from(aisles),
      },
      healthScore: {
        activeRatio: total > 0 ? (active / total) * 100 : 0,
        coverageRatio: total > 0 ? (productsCovered / total) * 100 : 0,
      },
    };

    console.log("✅ [LOCATIONS] Statistics calculated:", statistics);

    return {
      statistics,
    };
  } catch (error) {
    console.error("💥 [LOCATIONS] Error fetching statistics:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching location statistics",
    });
  }
});
