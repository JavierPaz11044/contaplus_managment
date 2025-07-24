import { ref, computed, watch } from "vue";
import { computedAsync } from "@vueuse/core";

// Product interface
export interface Product {
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Product form data interface
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  category: string;
  stockAlert?: number;
  isActive?: boolean;
}

// Statistics interface
export interface ProductStatistics {
  count: number;
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
  totalQuantity: number;
  totalValue: number;
  averageValue: number;
  categories: Record<string, number>;
  totalCategories: number;
  healthScore: {
    stockHealth: number;
    activeRatio: number;
  };
}

// Pagination interface
export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Hardcoded categories
export const PRODUCT_CATEGORIES = [
  { value: "food", label: "Comida" },
  { value: "technology", label: "Tecnología" },
  { value: "toys", label: "Juguetes" },
  { value: "clothing", label: "Ropa" },
  { value: "home", label: "Hogar" },
  { value: "sports", label: "Deportes" },
  { value: "books", label: "Libros" },
  { value: "health", label: "Salud y Belleza" },
  { value: "automotive", label: "Automotriz" },
  { value: "electronics", label: "Electrónicos" },
  { value: "furniture", label: "Muebles" },
  { value: "garden", label: "Jardín" },
] as const;

export const useProducts = () => {
  const { api } = useAxios();
  const { showToast } = useToast();
  const { getIdToken } = useAuth();

  // Helper function to process product dates
  const processProductDates = (product: Record<string, unknown>): Product => {
    return {
      ...product,
      createdAt: product.createdAt
        ? new Date(product.createdAt as string)
        : new Date(),
      updatedAt: product.updatedAt
        ? new Date(product.updatedAt as string)
        : new Date(),
    } as Product;
  };

  // Wait for authentication token to be available
  const waitForToken = async (): Promise<string | null> => {
    try {
      // Try to get token, with retries if needed
      for (let i = 0; i < 5; i++) {
        try {
          const token = await getIdToken();
          if (token) {
            console.log("🔑 [PRODUCTS] Auth token obtained");
            return token;
          }
        } catch (error) {
          console.warn(`🔑 [PRODUCTS] Token attempt ${i + 1} failed:`, error);
        }

        // Wait before retry
        if (i < 4) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.error("🔑 [PRODUCTS] Failed to obtain auth token after retries");
      return null;
    } catch (error) {
      console.error("🔑 [PRODUCTS] Error waiting for token:", error);
      return null;
    }
  };

  // Reactive state
  const products = ref<Product[]>([]);
  const statistics = ref<ProductStatistics | null>(null);
  const pagination = ref<ProductPagination | null>(null);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref<string | null>(null);
  const deleting = ref<string | null>(null);

  // Computed properties (using auto-loaded statistics)
  const totalProducts = computed(
    () => autoStatistics.value?.total || statistics.value?.total || 0
  );
  const activeProducts = computed(
    () => autoStatistics.value?.active || statistics.value?.active || 0
  );
  const lowStockProducts = computed(
    () => autoStatistics.value?.lowStock || statistics.value?.lowStock || 0
  );
  const totalCategories = computed(
    () =>
      autoStatistics.value?.totalCategories ||
      statistics.value?.totalCategories ||
      0
  );

  // Get category label by value
  const getCategoryLabel = (value: string): string => {
    const category = PRODUCT_CATEGORIES.find((cat) => cat.value === value);
    return category?.label || value;
  };

  // List products
  const listProducts = async (page: number = 1, limit: number = 10) => {
    loading.value = true;
    try {
      console.log("🔍 [PRODUCTS] Fetching products list");

      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(
        `products/list?page=${page}&limit=${limit}`
      );

      // Process products to ensure dates are in correct format
      const rawProducts = response.data.products || [];
      const processedProducts = rawProducts.map(processProductDates);

      products.value = processedProducts;
      pagination.value = response.data.pagination || null;

      console.log("✅ [PRODUCTS] Products loaded:", products.value.length);
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error fetching products:", error);
      showToast("Error loading products", "error");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Get product statistics
  const getStatistics = async () => {
    try {
      console.log("📊 [PRODUCTS] Fetching statistics");

      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get("products/count");

      statistics.value = response.data.statistics;
      console.log("✅ [PRODUCTS] Statistics loaded:", statistics.value);
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error fetching statistics:", error);
      showToast("Error loading statistics", "error");
      throw error;
    }
  };

  // Create product
  const createProduct = async (
    productData: ProductFormData
  ): Promise<Product> => {
    creating.value = true;
    try {
      console.log("➕ [PRODUCTS] Creating product:", productData.name);

      // Validate required fields
      if (!productData.name?.trim()) {
        throw new Error("Product name is required");
      }
      if (!productData.description?.trim()) {
        throw new Error("Product description is required");
      }
      if (!productData.sku?.trim()) {
        throw new Error("Product SKU is required");
      }
      if (productData.price < 0) {
        throw new Error("Price must be positive");
      }
      if (productData.quantity < 0) {
        throw new Error("Quantity must be non-negative");
      }

      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.post("products/create", productData);
      const rawProduct = response.data.product;

      // Process dates to ensure they're in correct format
      const newProduct = processProductDates(rawProduct);

      console.log("🔍 [PRODUCTS] Raw product from server:", {
        id: rawProduct.id,
        createdAt: rawProduct.createdAt,
        updatedAt: rawProduct.updatedAt,
        createdAtType: typeof rawProduct.createdAt,
        updatedAtType: typeof rawProduct.updatedAt,
      });

      console.log("🔍 [PRODUCTS] Processed product:", {
        id: newProduct.id,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
        createdAtType: typeof newProduct.createdAt,
        updatedAtType: typeof newProduct.updatedAt,
      });

      // Add to local products list
      products.value.unshift(newProduct);

      console.log("✅ [PRODUCTS] Product created:", newProduct.id);
      showToast("Product created successfully!", "success");

      // Refresh statistics
      await getStatistics();

      return newProduct;
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error creating product:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error creating product";
      showToast(message, "error");
      throw error;
    } finally {
      creating.value = false;
    }
  };

  // Update product
  const updateProduct = async (
    productId: string,
    updateData: Partial<ProductFormData>
  ): Promise<Product> => {
    updating.value = productId;
    try {
      console.log("✏️ [PRODUCTS] Updating product:", productId);
      console.log("📝 [PRODUCTS] Update data:", updateData);

      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.put(`products/${productId}`, updateData);
      const rawProduct = response.data.product;

      // Process dates to ensure they're in correct format
      const updatedProduct = processProductDates(rawProduct);

      console.log("🔍 [PRODUCTS] Raw updated product from server:", {
        id: rawProduct.id,
        createdAt: rawProduct.createdAt,
        updatedAt: rawProduct.updatedAt,
        createdAtType: typeof rawProduct.createdAt,
        updatedAtType: typeof rawProduct.updatedAt,
      });

      // Update in local products list
      const index = products.value.findIndex((p) => p.id === productId);
      if (index !== -1) {
        products.value[index] = updatedProduct;
        console.log(
          "✅ [PRODUCTS] Local product list updated at index:",
          index
        );
      }

      console.log("✅ [PRODUCTS] Product updated:", productId);
      showToast("Product updated successfully!", "success");

      return updatedProduct;
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error updating product:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error updating product";
      showToast(message, "error");
      throw error;
    } finally {
      updating.value = null;
    }
  };

  // Delete product
  const deleteProduct = async (productId: string): Promise<void> => {
    deleting.value = productId;
    try {
      console.log("🗑️ [PRODUCTS] Deleting product:", productId);

      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      await api.delete(`products/${productId}`);

      // Remove from local products list
      products.value = products.value.filter((p) => p.id !== productId);

      console.log("✅ [PRODUCTS] Product deleted:", productId);
      showToast("Product deleted successfully!", "success");

      // Refresh statistics
      await getStatistics();
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error deleting product:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error deleting product";
      showToast(message, "error");
      throw error;
    } finally {
      deleting.value = null;
    }
  };

  // Get single product
  const getProduct = async (productId: string): Promise<Product> => {
    try {
      console.log("🔍 [PRODUCTS] Fetching product:", productId);
      // Wait for authentication token
      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(`products/${productId}`);

      console.log("✅ [PRODUCTS] Product loaded:", productId);
      return response.data.product;
    } catch (error: unknown) {
      console.error("💥 [PRODUCTS] Error fetching product:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error loading product";
      showToast(message, "error");
      throw error;
    }
  };

  // Auto-load products with computedAsync
  const autoProducts = computedAsync(async () => {
    try {
      console.log("🔄 [PRODUCTS] Auto-loading products...");
      const token = await waitForToken();
      if (!token) {
        console.warn("🔑 [PRODUCTS] No token available, skipping auto-load");
        return [];
      }

      const response = await api.get(`products/?page=1&limit=50`);
      const rawProducts = response.data.products || [];

      // Process products to ensure dates are in correct format
      const loadedProducts = rawProducts.map(processProductDates);

      // Update pagination info
      pagination.value = response.data.pagination || null;

      console.log("✅ [PRODUCTS] Auto-loaded products:", loadedProducts.length);
      return loadedProducts;
    } catch (error) {
      console.error("💥 [PRODUCTS] Error auto-loading products:", error);
      return [];
    }
  }, []);

  // Auto-load statistics with computedAsync
  const autoStatistics = computedAsync(async () => {
    try {
      console.log("📊 [PRODUCTS] Auto-loading statistics...");
      const token = await waitForToken();
      if (!token) {
        console.warn(
          "🔑 [PRODUCTS] No token available, skipping stats auto-load"
        );
        return null;
      }

      const response = await api.get("products/count");
      const stats = response.data.statistics;

      console.log("✅ [PRODUCTS] Auto-loaded statistics:", stats);
      return stats;
    } catch (error) {
      console.error("💥 [PRODUCTS] Error auto-loading statistics:", error);
      return null;
    }
  }, null);

  // Initialize data (legacy method for manual loading)
  const initializeProducts = async () => {
    await Promise.all([listProducts(), getStatistics()]);
  };

  // Validation helpers
  const validateProductData = (data: ProductFormData): string[] => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Product name is required");
    } else if (data.name.length > 100) {
      errors.push("Product name is too long (max 100 characters)");
    }

    if (!data.description?.trim()) {
      errors.push("Product description is required");
    } else if (data.description.length > 500) {
      errors.push("Product description is too long (max 500 characters)");
    }

    if (!data.sku?.trim()) {
      errors.push("Product SKU is required");
    } else if (data.sku.length > 50) {
      errors.push("Product SKU is too long (max 50 characters)");
    }

    if (data.price < 0) {
      errors.push("Price must be positive");
    }

    if (data.quantity < 0) {
      errors.push("Quantity must be non-negative");
    }

    if (!data.category?.trim()) {
      errors.push("Product category is required");
    }

    return errors;
  };

  // Sync autoProducts with products ref when it changes
  watch(
    autoProducts,
    (newProducts) => {
      if (newProducts && newProducts.length > 0) {
        products.value = newProducts;
      }
    },
    { immediate: true }
  );

  // Sync autoStatistics with statistics ref when it changes
  watch(
    autoStatistics,
    (newStats) => {
      if (newStats) {
        statistics.value = newStats;
      }
    },
    { immediate: true }
  );

  return {
    // State (auto-loading)
    products: readonly(products),
    statistics: readonly(statistics),
    pagination: readonly(pagination),
    loading: readonly(loading),
    creating: readonly(creating),
    updating: readonly(updating),
    deleting: readonly(deleting),

    // Auto-loaded data (computedAsync)
    autoProducts: readonly(autoProducts),
    autoStatistics: readonly(autoStatistics),

    // Computed
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalCategories,

    // Constants
    PRODUCT_CATEGORIES,

    // Methods
    listProducts,
    getStatistics,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    initializeProducts,
    getCategoryLabel,
    validateProductData,
  };
};
