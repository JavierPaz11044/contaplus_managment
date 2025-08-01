import { computed } from "vue";
import { computedAsync } from "@vueuse/core";

export const useProductsForLocations = () => {
  const { api } = useAxios();
  const { getIdToken } = useAuth();

  // Wait for authentication token to be available
  const waitForToken = async (): Promise<string | null> => {
    try {
      for (let i = 0; i < 5; i++) {
        try {
          const token = await getIdToken();
          if (token) {
            console.log("🔑 [PRODUCTS-FOR-LOCATIONS] Auth token obtained");
            return token;
          }
        } catch (error) {
          console.warn(
            `🔑 [PRODUCTS-FOR-LOCATIONS] Token attempt ${i + 1} failed:`,
            error
          );
        }

        if (i < 4) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.error(
        "🔑 [PRODUCTS-FOR-LOCATIONS] Failed to obtain auth token after retries"
      );
      return null;
    } catch (error) {
      console.error(
        "🔑 [PRODUCTS-FOR-LOCATIONS] Error waiting for token:",
        error
      );
      return null;
    }
  };

  // Auto-load products with computedAsync
  const autoProducts = computedAsync(async () => {
    try {
      console.log("🔄 [PRODUCTS-FOR-LOCATIONS] Auto-loading products...");
      const token = await waitForToken();
      if (!token) {
        console.warn(
          "🔑 [PRODUCTS-FOR-LOCATIONS] No token available, skipping auto-load"
        );
        return [];
      }

      const response = await api.get(`products/list?page=1&limit=100`);
      const rawProducts = response.data.products || [];

      console.log(
        "✅ [PRODUCTS-FOR-LOCATIONS] Auto-loaded products:",
        rawProducts.length
      );
      return rawProducts;
    } catch (error) {
      console.error(
        "💥 [PRODUCTS-FOR-LOCATIONS] Error auto-loading products:",
        error
      );
      return [];
    }
  }, []);

  // Computed properties for filtered products
  const activeProducts = computed(() =>
    autoProducts.value.filter((product: any) => product.isActive)
  );

  const productsWithLocations = computed(() =>
    autoProducts.value.filter((product: any) => product.hasLocation)
  );

  const productsWithoutLocations = computed(() =>
    autoProducts.value.filter((product: any) => !product.hasLocation)
  );

  return {
    // Auto-loaded data
    autoProducts: readonly(autoProducts),

    // Computed filtered products
    activeProducts,
    productsWithLocations,
    productsWithoutLocations,
  };
};
