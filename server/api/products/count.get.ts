import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Query schema for counting with filters
const countQuerySchema = z.object({
  category: z.string().optional(),
  isActive: z.string().optional(),
  lowStock: z.string().optional(), // "true" to count only low stock items
});

export default defineEventHandler(async (event) => {
  console.log("📊 [PRODUCTS] COUNT - Getting product statistics");

  try {
    const sellerId = event.context.userId;
    const query = getQuery(event);

    console.log("👤 [PRODUCTS] Seller ID:", sellerId);
    console.log("🔍 [PRODUCTS] Count query params:", query);

    // Validate query parameters
    const { category, isActive, lowStock } = countQuerySchema.parse(query);

    const db = getFirestore();
    let productsQuery = db
      .collection("products")
      .where("sellerId", "==", sellerId);

    // Apply filters for specific count
    if (category) {
      productsQuery = productsQuery.where("category", "==", category);
      console.log("🏷️ [PRODUCTS] Counting by category:", category);
    }

    if (isActive !== undefined) {
      const activeFilter = isActive === "true";
      productsQuery = productsQuery.where("isActive", "==", activeFilter);
      console.log("✅ [PRODUCTS] Counting by active status:", activeFilter);
    }

    // Get all products for this seller for comprehensive stats
    console.log("📈 [PRODUCTS] Fetching all products for statistics");
    const allProductsSnapshot = await db
      .collection("products")
      .where("sellerId", "==", sellerId)
      .get();

    let totalProducts = 0;
    let activeProducts = 0;
    let inactiveProducts = 0;
    let lowStockProducts = 0;
    let totalQuantity = 0;
    let totalValue = 0;
    const categoryCounts: Record<string, number> = {};

    // Calculate comprehensive statistics
    allProductsSnapshot.forEach((doc) => {
      const data = doc.data();

      totalProducts++;

      if (data.isActive === true) {
        activeProducts++;
      } else {
        inactiveProducts++;
      }

      // Check for low stock (quantity <= stockAlert)
      if (data.quantity <= (data.stockAlert || 10)) {
        lowStockProducts++;
      }

      // Add to total quantity and value
      totalQuantity += data.quantity || 0;
      totalValue += (data.quantity || 0) * (data.price || 0);

      // Count by category
      const category = data.category || "Uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Get filtered count if specific filters are applied
    let filteredCount = totalProducts;
    if (category || isActive !== undefined) {
      const filteredSnapshot = await productsQuery.get();
      filteredCount = filteredSnapshot.size;

      // If lowStock filter is requested, count manually
      if (lowStock === "true") {
        let lowStockCount = 0;
        filteredSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.quantity <= (data.stockAlert || 10)) {
            lowStockCount++;
          }
        });
        filteredCount = lowStockCount;
      }
    } else if (lowStock === "true") {
      filteredCount = lowStockProducts;
    }

    const statistics = {
      // Filtered count based on query parameters
      count: filteredCount,

      // Overall statistics
      total: totalProducts,
      active: activeProducts,
      inactive: inactiveProducts,
      lowStock: lowStockProducts,

      // Inventory statistics
      totalQuantity,
      totalValue: Math.round(totalValue * 100) / 100, // Round to 2 decimal places
      averageValue:
        totalProducts > 0
          ? Math.round((totalValue / totalProducts) * 100) / 100
          : 0,

      // Category breakdown
      categories: categoryCounts,
      totalCategories: Object.keys(categoryCounts).length,

      // Health indicators
      healthScore: {
        stockHealth:
          totalProducts > 0
            ? Math.round(
                ((totalProducts - lowStockProducts) / totalProducts) * 100
              )
            : 0,
        activeRatio:
          totalProducts > 0
            ? Math.round((activeProducts / totalProducts) * 100)
            : 0,
      },
    };

    console.log("✅ [PRODUCTS] Statistics calculated successfully:", {
      total: statistics.total,
      active: statistics.active,
      lowStock: statistics.lowStock,
      categories: statistics.totalCategories,
      filteredCount: statistics.count,
    });

    return {
      statistics,
      query: {
        category,
        isActive,
        lowStock,
      },
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error calculating statistics:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error calculating product statistics",
    });
  }
});
