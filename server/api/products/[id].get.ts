import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  console.log("📦 [PRODUCTS] GET - Retrieving product by ID");

  try {
    const sellerId = event.context.userId;
    const productId = getRouterParam(event, "id");

    console.log("👤 [PRODUCTS] Seller ID:", sellerId);
    console.log("🔍 [PRODUCTS] Product ID:", productId);

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Product ID is required",
      });
    }

    const db = getFirestore();

    // Get the product document
    console.log("💾 [PRODUCTS] Fetching product from database");
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      console.warn("⚠️ [PRODUCTS] Product not found");
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    const productData = productDoc.data();

    // Verify that the product belongs to the current seller
    if (productData?.sellerId !== sellerId) {
      console.warn("🚫 [PRODUCTS] Unauthorized access attempt:", {
        productSeller: productData?.sellerId,
        requestingSeller: sellerId,
      });
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied - Product belongs to another seller",
      });
    }

    const product = {
      id: productDoc.id,
      name: productData?.name,
      description: productData?.description,
      price: productData?.price,
      quantity: productData?.quantity,
      sku: productData?.sku,
      category: productData?.category,
      sellerId: productData?.sellerId,
      isActive: productData?.isActive,
      stockAlert: productData?.stockAlert,
      createdAt: productData?.createdAt?.toDate?.() || productData?.createdAt,
      updatedAt: productData?.updatedAt?.toDate?.() || productData?.updatedAt,
    };

    console.log("✅ [PRODUCTS] Product retrieved successfully:", {
      id: product.id,
      name: product.name,
      sku: product.sku,
    });

    return {
      product,
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error retrieving product:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Generic error fallback
    console.error("🔥 [PRODUCTS] Unexpected error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error retrieving product",
    });
  }
});
