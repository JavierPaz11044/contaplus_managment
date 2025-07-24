import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  console.log("📦 [PRODUCTS] DELETE - Removing product");

  try {
    const sellerId = event.context.userId;
    const productId = getRouterParam(event, "id");

    console.log("👤 [PRODUCTS] Seller ID:", sellerId);
    console.log("🗑️ [PRODUCTS] Product ID to delete:", productId);

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Product ID is required",
      });
    }

    const db = getFirestore();

    // Get the product document first to verify ownership
    console.log("🔍 [PRODUCTS] Checking if product exists");
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
      console.warn("🚫 [PRODUCTS] Unauthorized delete attempt:", {
        productSeller: productData?.sellerId,
        requestingSeller: sellerId,
      });
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied - Product belongs to another seller",
      });
    }

    // Store product info for logging before deletion
    const productInfo = {
      id: productDoc.id,
      name: productData?.name,
      sku: productData?.sku,
      category: productData?.category,
    };

    // Delete the product
    console.log("💾 [PRODUCTS] Deleting product from database");
    await productDoc.ref.delete();

    console.log("✅ [PRODUCTS] Product deleted successfully:", productInfo);

    return {
      message: "Product deleted successfully",
      deletedProduct: productInfo,
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error deleting product:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Generic error fallback
    console.error("🔥 [PRODUCTS] Unexpected error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error deleting product",
    });
  }
});
