import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  try {
    console.log("📦 [PUBLIC-PRODUCTS] Starting products request");

    // Get company ID from URL parameter
    const companyId = getRouterParam(event, "companyId");

    if (!companyId) {
      console.log("❌ [PUBLIC-PRODUCTS] No company ID provided");
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    console.log(
      "🔍 [PUBLIC-PRODUCTS] Looking for products of company:",
      companyId
    );

    // Get Firestore instance
    const db = getFirestore();

    // Get company document to verify it exists
    const companyDoc = await db.collection("companies").doc(companyId).get();

    if (!companyDoc.exists) {
      console.log("❌ [PUBLIC-PRODUCTS] Company not found:", companyId);
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    // Get all products for this company
    const productsSnapshot = await db
      .collection("products")
      .where("companyId", "==", companyId)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const products = [];

    for (const doc of productsSnapshot.docs) {
      const productData = doc.data();

      // Get product locations
      const locationsSnapshot = await db
        .collection("locations")
        .where("productId", "==", doc.id)
        .where("isActive", "==", true)
        .get();

      const locations = locationsSnapshot.docs.map((locDoc) => {
        const locData = locDoc.data();
        return {
          id: locDoc.id,
          name: locData.name,
          zone: locData.zone,
          section: locData.section,
          position: locData.position,
          createdAt: locData.createdAt,
        };
      });

      // Get active promotions for this product
      const promotionsSnapshot = await db
        .collection("promotions")
        .where("productId", "==", doc.id)
        .where("isActive", "==", true)
        .get();

      const promotions = promotionsSnapshot.docs.map((promoDoc) => {
        const promoData = promoDoc.data();
        return {
          id: promoDoc.id,
          title: promoData.title,
          message: promoData.message,
          discountType: promoData.discountType,
          discountValue: promoData.discountValue,
          startDate: promoData.startDate,
          endDate: promoData.endDate,
          uses: promoData.uses || 0,
        };
      });

      products.push({
        id: doc.id,
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        isActive: productData.isActive,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
        locations: locations,
        promotions: promotions,
        stats: {
          totalLocations: locations.length,
          activePromotions: promotions.length,
          hasLowStock: productData.stock < 10,
        },
      });
    }

    const response = {
      companyId: companyId,
      companyName: companyDoc.data()?.name || "Unknown Company",
      totalProducts: products.length,
      products: products,
    };

    console.log("✅ [PUBLIC-PRODUCTS] Products retrieved successfully:", {
      companyId,
      totalProducts: products.length,
    });

    return response;
  } catch (error: unknown) {
    console.error("💥 [PUBLIC-PRODUCTS] Error:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
