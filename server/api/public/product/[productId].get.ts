import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  try {
    console.log("📦 [PUBLIC-PRODUCT] Starting product detail request");

    // Get product ID from URL parameter
    const productId = getRouterParam(event, "productId");

    if (!productId) {
      console.log("❌ [PUBLIC-PRODUCT] No product ID provided");
      throw createError({
        statusCode: 400,
        statusMessage: "Product ID is required",
      });
    }

    console.log("🔍 [PUBLIC-PRODUCT] Looking for product:", productId);

    // Get Firestore instance
    const db = getFirestore();

    // Get product document
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      console.log("❌ [PUBLIC-PRODUCT] Product not found:", productId);
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    const productData = productDoc.data();

    if (!productData) {
      console.log("❌ [PUBLIC-PRODUCT] Product data is null");
      throw createError({
        statusCode: 404,
        statusMessage: "Product data not found",
      });
    }

    // Get company information
    let companyInfo = null;
    if (productData.companyId) {
      try {
        const companyDoc = await db
          .collection("companies")
          .doc(productData.companyId)
          .get();
        if (companyDoc.exists) {
          const companyData = companyDoc.data();
          companyInfo = {
            id: productData.companyId,
            name: companyData?.name,
            ruc: companyData?.ruc,
            phone: companyData?.phone,
            address: companyData?.address,
          };
        }
      } catch (error) {
        console.log("⚠️ [PUBLIC-PRODUCT] Could not fetch company info:", error);
      }
    }

    // Get product locations
    const locationsSnapshot = await db
      .collection("locations")
      .where("productId", "==", productId)
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
        isActive: locData.isActive,
        createdAt: locData.createdAt,
        updatedAt: locData.updatedAt,
      };
    });

    // Get active promotions for this product
    const promotionsSnapshot = await db
      .collection("promotions")
      .where("productId", "==", productId)
      .where("isActive", "==", true)
      .get();

    const promotions = promotionsSnapshot.docs.map((promoDoc) => {
      const promoData = promoDoc.data();

      // Calculate promotion status
      const now = new Date();
      const startDate = promoData.startDate?.toDate();
      const endDate = promoData.endDate?.toDate();

      let status = "inactive";
      if (startDate && endDate) {
        if (now >= startDate && now <= endDate) {
          status = "active";
        } else if (now < startDate) {
          status = "upcoming";
        } else if (now > endDate) {
          status = "expired";
        }
      }

      return {
        id: promoDoc.id,
        title: promoData.title,
        message: promoData.message,
        discountType: promoData.discountType,
        discountValue: promoData.discountValue,
        startDate: promoData.startDate,
        endDate: promoData.endDate,
        uses: promoData.uses || 0,
        status: status,
        isActive: promoData.isActive,
      };
    });

    // Calculate product statistics
    const activePromotions = promotions.filter((p) => p.status === "active");
    const upcomingPromotions = promotions.filter(
      (p) => p.status === "upcoming"
    );
    const hasLowStock = productData.stock < 10;

    const response = {
      product: {
        id: productId,
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        isActive: productData.isActive,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      },
      company: companyInfo,
      locations: locations,
      promotions: promotions,
      stats: {
        totalLocations: locations.length,
        activePromotions: activePromotions.length,
        upcomingPromotions: upcomingPromotions.length,
        hasLowStock: hasLowStock,
        hasPromotions: promotions.length > 0,
        hasLocations: locations.length > 0,
      },
    };

    console.log("✅ [PUBLIC-PRODUCT] Product detail retrieved successfully:", {
      productId,
      productName: productData.name,
      totalLocations: locations.length,
      totalPromotions: promotions.length,
    });

    return response;
  } catch (error: unknown) {
    console.error("💥 [PUBLIC-PRODUCT] Error:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
