import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Product update schema (all fields optional except for validation)
const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long")
    .optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative").optional(),
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long").optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category too long")
    .optional(),
  stockAlert: z
    .number()
    .int()
    .min(0, "Stock alert must be non-negative")
    .optional(),
  isActive: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  console.log("📦 [PRODUCTS] PUT - Updating product");

  try {
    const sellerId = event.context.userId;
    const productId = getRouterParam(event, "id");
    const body = await readBody(event);

    console.log("👤 [PRODUCTS] Seller ID:", sellerId);
    console.log("🔍 [PRODUCTS] Product ID:", productId);
    console.log("📝 [PRODUCTS] Update data received:", body);

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Product ID is required",
      });
    }

    // Validate input data
    const updateData = updateProductSchema.parse(body);

    // Check if no data to update
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No valid fields provided for update",
      });
    }

    const db = getFirestore();

    // Get the existing product
    console.log("🔍 [PRODUCTS] Checking if product exists");
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      console.warn("⚠️ [PRODUCTS] Product not found");
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    const existingData = productDoc.data();

    // Verify ownership
    if (existingData?.sellerId !== sellerId) {
      console.warn("🚫 [PRODUCTS] Unauthorized update attempt:", {
        productSeller: existingData?.sellerId,
        requestingSeller: sellerId,
      });
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied - Product belongs to another seller",
      });
    }

    // Check SKU uniqueness if SKU is being updated
    if (updateData.sku && updateData.sku !== existingData?.sku) {
      console.log("🔍 [PRODUCTS] Checking new SKU uniqueness:", updateData.sku);
      const existingSku = await db
        .collection("products")
        .where("sellerId", "==", sellerId)
        .where("sku", "==", updateData.sku)
        .get();

      if (!existingSku.empty) {
        console.warn("⚠️ [PRODUCTS] SKU already exists for seller");
        throw createError({
          statusCode: 409,
          statusMessage: "Product with this SKU already exists",
        });
      }
    }

    // Prepare update data
    const updateFields = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Update the product
    console.log("💾 [PRODUCTS] Updating product in database");
    await productDoc.ref.update(updateFields);

    // Get the updated product
    const updatedDoc = await productDoc.ref.get();
    const updatedProduct = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Record<string, unknown>;

    console.log("✅ [PRODUCTS] Product updated successfully:", {
      id: updatedProduct.id,
      name: updatedProduct.name,
      sku: updatedProduct.sku,
      updatedFields: Object.keys(updateData),
    });

    return {
      product: updatedProduct,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error updating product:", error);

    if (error instanceof z.ZodError) {
      console.error("📋 [PRODUCTS] Validation errors:", error.errors);
      throw createError({
        statusCode: 400,
        statusMessage:
          "Invalid product data: " +
          error.errors.map((e) => e.message).join(", "),
      });
    }

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Generic error fallback
    console.error("🔥 [PRODUCTS] Unexpected error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error updating product",
    });
  }
});
