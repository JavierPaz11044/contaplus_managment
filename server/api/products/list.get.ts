import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  category: string;
  sellerId: string;
  isActive: boolean;
  stockAlert: number;
  createdAt: Date | unknown;
  updatedAt: Date | unknown;
}

// Query schema for filtering and pagination
const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  category: z.string().optional(),
  isActive: z.string().optional(),
  search: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  console.log("📦 [PRODUCTS] GET - Listing products");

  try {
    const sellerId = event.context.userId;
    const query = getQuery(event);

    console.log("🔍 [PRODUCTS] Query params:", query);
    console.log("👤 [PRODUCTS] Seller ID:", sellerId);

    // Validate query parameters
    const { page, limit, category, isActive, search } =
      querySchema.parse(query);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const db = getFirestore();
    let productsQuery = db
      .collection("products")
      .where("sellerId", "==", sellerId)
      .orderBy("createdAt", "desc");

    // Apply filters
    if (category) {
      productsQuery = productsQuery.where("category", "==", category);
      console.log("🏷️ [PRODUCTS] Filtering by category:", category);
    }

    if (isActive !== undefined) {
      const activeFilter = isActive === "true";
      productsQuery = productsQuery.where("isActive", "==", activeFilter);
      console.log("✅ [PRODUCTS] Filtering by active status:", activeFilter);
    }

    // Get total count for pagination
    const totalSnapshot = await productsQuery.get();
    const total = totalSnapshot.size;

    // Apply pagination
    const snapshot = await productsQuery.offset(offset).limit(limitNum).get();

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();

      // Apply search filter if provided (client-side filtering for now)
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = data.name?.toLowerCase().includes(searchLower);
        const descMatch = data.description?.toLowerCase().includes(searchLower);
        const skuMatch = data.sku?.toLowerCase().includes(searchLower);

        if (!nameMatch && !descMatch && !skuMatch) {
          return; // Skip this product
        }
      }

      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        sku: data.sku,
        category: data.category,
        sellerId: data.sellerId,
        isActive: data.isActive,
        stockAlert: data.stockAlert,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });

    console.log(
      `✅ [PRODUCTS] Retrieved ${products.length} products (page ${pageNum})`
    );

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error listing products:", error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error retrieving products",
    });
  }
});
