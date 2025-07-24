import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Product creation schema
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category too long"),
  stockAlert: z
    .number()
    .int()
    .min(0, "Stock alert must be non-negative")
    .default(10),
  isActive: z.boolean().default(true),
});

export default defineEventHandler(async (event) => {
  console.log("📦 [PRODUCTS] POST - Creating new product");

  try {
    const sellerId = event.context.userId;
    const body = await readBody(event);

    console.log("👤 [PRODUCTS] Seller ID:", sellerId);
    console.log("📝 [PRODUCTS] Product data received:", {
      name: body.name,
      sku: body.sku,
      category: body.category,
      price: body.price,
      quantity: body.quantity,
    });

    // Validate input data
    const productData = createProductSchema.parse(body);

    const db = getFirestore();

    // Check if SKU already exists for this seller
    console.log("🔍 [PRODUCTS] Checking SKU uniqueness:", productData.sku);
    const existingSku = await db
      .collection("products")
      .where("sellerId", "==", sellerId)
      .where("sku", "==", productData.sku)
      .get();

    if (!existingSku.empty) {
      console.warn("⚠️ [PRODUCTS] SKU already exists for seller");
      throw createError({
        statusCode: 409,
        statusMessage: "Product with this SKU already exists",
      });
    }

    // Create new product document
    const now = new Date();
    const newProduct = {
      ...productData,
      sellerId,
      createdAt: now,
      updatedAt: now,
    };

    console.log("💾 [PRODUCTS] Creating product in database");
    const docRef = await db.collection("products").add(newProduct);

    // Get the created product with its ID
    const createdDoc = await docRef.get();
    const createdProduct = {
      id: createdDoc.id,
      ...createdDoc.data(),
    } as Record<string, unknown>;

    console.log("✅ [PRODUCTS] Product created successfully:", {
      id: createdProduct.id,
      name: createdProduct.name,
      sku: createdProduct.sku,
    });

    return {
      product: createdProduct,
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("💥 [PRODUCTS] Error creating product:", error);

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
      statusMessage: "Error creating product",
    });
  }
});
