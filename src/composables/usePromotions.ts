import { ref, computed, watch } from "vue";
import { computedAsync } from "@vueuse/core";

// Promotion interface
export interface Promotion {
  id: string;
  title: string;
  description: string;
  message: string;
  productId: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  startDate: Date | string;
  endDate: Date | string;
  sellerId: string;
  isActive: boolean;
  currentUses: number;
  maxUses?: number;
  conditions?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Promotion form data interface
export interface PromotionFormData {
  title: string;
  description: string;
  message: string;
  productId: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  maxUses?: number;
  conditions?: string;
}

// Statistics interface
export interface PromotionStatistics {
  count: number;
  total: number;
  active: number;
  inactive: number;
  current: number;
  upcoming: number;
  expired: number;
  totalUses: number;
  totalMaxUses: number;
  usageRate: number;
  avgDiscountValue: number;
  productsWithPromotions: number;
  discountTypes: {
    percentage: number;
    fixed: number;
    free_shipping: number;
  };
  healthScore: {
    activeRatio: number;
    currentRatio: number;
    usageRatio: number;
  };
}

// Pagination interface
export interface PromotionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Predefined discount types
export const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)", symbol: "%" },
  { value: "fixed", label: "Fixed Amount ($)", symbol: "$" },
  { value: "free_shipping", label: "Free Shipping", symbol: "🚚" },
] as const;

export const usePromotions = () => {
  const { api } = useAxios();
  const { showToast } = useToast();
  const { getIdToken } = useAuth();

  // Helper function to process promotion dates
  const processPromotionDates = (
    promotion: Record<string, unknown>
  ): Promotion => {
    return {
      ...promotion,
      startDate: promotion.startDate
        ? new Date(promotion.startDate as string)
        : new Date(),
      endDate: promotion.endDate
        ? new Date(promotion.endDate as string)
        : new Date(),
      createdAt: promotion.createdAt
        ? new Date(promotion.createdAt as string)
        : new Date(),
      updatedAt: promotion.updatedAt
        ? new Date(promotion.updatedAt as string)
        : new Date(),
    } as Promotion;
  };

  // Wait for authentication token to be available
  const waitForToken = async (): Promise<string | null> => {
    try {
      for (let i = 0; i < 5; i++) {
        try {
          const token = await getIdToken();
          if (token) {
            console.log("🔑 [PROMOTIONS] Auth token obtained");
            return token;
          }
        } catch (error) {
          console.warn(`🔑 [PROMOTIONS] Token attempt ${i + 1} failed:`, error);
        }

        if (i < 4) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.error(
        "🔑 [PROMOTIONS] Failed to obtain auth token after retries"
      );
      return null;
    } catch (error) {
      console.error("🔑 [PROMOTIONS] Error waiting for token:", error);
      return null;
    }
  };

  // Reactive state
  const promotions = ref<Promotion[]>([]);
  const statistics = ref<PromotionStatistics | null>(null);
  const pagination = ref<PromotionPagination | null>(null);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref<string | null>(null);
  const deleting = ref<string | null>(null);

  // Computed properties
  const totalPromotions = computed(
    () => autoStatistics.value?.total || statistics.value?.total || 0
  );
  const activePromotions = computed(
    () => autoStatistics.value?.active || statistics.value?.active || 0
  );
  const currentPromotions = computed(
    () => autoStatistics.value?.current || statistics.value?.current || 0
  );
  const upcomingPromotions = computed(
    () => autoStatistics.value?.upcoming || statistics.value?.upcoming || 0
  );

  // List promotions
  const listPromotions = async (page: number = 1, limit: number = 10) => {
    loading.value = true;
    try {
      console.log("🔍 [PROMOTIONS] Fetching promotions list");

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(`promotions/?page=${page}&limit=${limit}`);

      const rawPromotions = response.data.promotions || [];
      const processedPromotions = rawPromotions.map(processPromotionDates);

      promotions.value = processedPromotions;
      pagination.value = response.data.pagination || null;

      console.log(
        "✅ [PROMOTIONS] Promotions loaded:",
        promotions.value.length
      );
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error fetching promotions:", error);
      showToast("Error loading promotions", "error");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Get promotion statistics
  const getStatistics = async () => {
    try {
      console.log("📊 [PROMOTIONS] Fetching statistics");

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get("promotions/count");

      statistics.value = response.data.statistics;
      console.log("✅ [PROMOTIONS] Statistics loaded:", statistics.value);
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error fetching statistics:", error);
      showToast("Error loading statistics", "error");
      throw error;
    }
  };

  // Create promotion
  const createPromotion = async (
    promotionData: PromotionFormData
  ): Promise<Promotion> => {
    creating.value = true;
    try {
      console.log("➕ [PROMOTIONS] Creating promotion:", promotionData.title);

      // Validate required fields
      if (!promotionData.title?.trim()) {
        throw new Error("Promotion title is required");
      }
      if (!promotionData.description?.trim()) {
        throw new Error("Promotion description is required");
      }
      if (!promotionData.message?.trim()) {
        throw new Error("Promotion message is required");
      }
      if (!promotionData.productId?.trim()) {
        throw new Error("Product ID is required");
      }
      if (!promotionData.startDate?.trim()) {
        throw new Error("Start date is required");
      }
      if (!promotionData.endDate?.trim()) {
        throw new Error("End date is required");
      }

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.post("promotions/", promotionData);
      const rawPromotion = response.data.promotion;

      const newPromotion = processPromotionDates(rawPromotion);

      // Add to local promotions list
      promotions.value.unshift(newPromotion);

      console.log("✅ [PROMOTIONS] Promotion created:", newPromotion.id);
      showToast("Promotion created successfully!", "success");

      // Refresh statistics
      await getStatistics();

      return newPromotion;
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error creating promotion:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error creating promotion";
      showToast(message, "error");
      throw error;
    } finally {
      creating.value = false;
    }
  };

  // Update promotion
  const updatePromotion = async (
    promotionId: string,
    updateData: Partial<PromotionFormData>
  ): Promise<Promotion> => {
    updating.value = promotionId;
    try {
      console.log("✏️ [PROMOTIONS] Updating promotion:", promotionId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.put(`promotions/${promotionId}`, updateData);
      const rawPromotion = response.data.promotion;

      const updatedPromotion = processPromotionDates(rawPromotion);

      // Update in local promotions list
      const index = promotions.value.findIndex((p) => p.id === promotionId);
      if (index !== -1) {
        promotions.value[index] = updatedPromotion;
      }

      console.log("✅ [PROMOTIONS] Promotion updated:", promotionId);
      showToast("Promotion updated successfully!", "success");

      return updatedPromotion;
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error updating promotion:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error updating promotion";
      showToast(message, "error");
      throw error;
    } finally {
      updating.value = null;
    }
  };

  // Delete promotion
  const deletePromotion = async (promotionId: string): Promise<void> => {
    deleting.value = promotionId;
    try {
      console.log("🗑️ [PROMOTIONS] Deleting promotion:", promotionId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      await api.delete(`promotions/${promotionId}`);

      // Remove from local promotions list
      promotions.value = promotions.value.filter((p) => p.id !== promotionId);

      console.log("✅ [PROMOTIONS] Promotion deleted:", promotionId);
      showToast("Promotion deleted successfully!", "success");

      // Refresh statistics
      await getStatistics();
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error deleting promotion:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error deleting promotion";
      showToast(message, "error");
      throw error;
    } finally {
      deleting.value = null;
    }
  };

  // Get single promotion
  const getPromotion = async (promotionId: string): Promise<Promotion> => {
    try {
      console.log("🔍 [PROMOTIONS] Fetching promotion:", promotionId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(`promotions/${promotionId}`);

      console.log("✅ [PROMOTIONS] Promotion loaded:", promotionId);
      return response.data.promotion;
    } catch (error: unknown) {
      console.error("💥 [PROMOTIONS] Error fetching promotion:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error loading promotion";
      showToast(message, "error");
      throw error;
    }
  };

  // Auto-load promotions with computedAsync
  const autoPromotions = computedAsync(async () => {
    try {
      console.log("🔄 [PROMOTIONS] Auto-loading promotions...");
      const token = await waitForToken();
      if (!token) {
        console.warn("🔑 [PROMOTIONS] No token available, skipping auto-load");
        return [];
      }

      const response = await api.get(`promotions/?page=1&limit=50`);
      const rawPromotions = response.data.promotions || [];

      const loadedPromotions = rawPromotions.map(processPromotionDates);

      pagination.value = response.data.pagination || null;

      console.log(
        "✅ [PROMOTIONS] Auto-loaded promotions:",
        loadedPromotions.length
      );
      return loadedPromotions;
    } catch (error) {
      console.error("💥 [PROMOTIONS] Error auto-loading promotions:", error);
      return [];
    }
  }, []);

  // Auto-load statistics with computedAsync
  const autoStatistics = computedAsync(async () => {
    try {
      console.log("📊 [PROMOTIONS] Auto-loading statistics...");
      const token = await waitForToken();
      if (!token) {
        console.warn(
          "🔑 [PROMOTIONS] No token available, skipping stats auto-load"
        );
        return null;
      }

      const response = await api.get("promotions/count");
      const stats = response.data.statistics;

      console.log("✅ [PROMOTIONS] Auto-loaded statistics:", stats);
      return stats;
    } catch (error) {
      console.error("💥 [PROMOTIONS] Error auto-loading statistics:", error);
      return null;
    }
  }, null);

  // Initialize data (legacy method for manual loading)
  const initializePromotions = async () => {
    await Promise.all([listPromotions(), getStatistics()]);
  };

  // Validation helpers
  const validatePromotionData = (data: PromotionFormData): string[] => {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push("Promotion title is required");
    } else if (data.title.length > 100) {
      errors.push("Promotion title is too long (max 100 characters)");
    }

    if (!data.description?.trim()) {
      errors.push("Promotion description is required");
    } else if (data.description.length > 500) {
      errors.push("Promotion description is too long (max 500 characters)");
    }

    if (!data.message?.trim()) {
      errors.push("Promotion message is required");
    } else if (data.message.length > 200) {
      errors.push("Promotion message is too long (max 200 characters)");
    }

    if (!data.productId?.trim()) {
      errors.push("Product ID is required");
    }

    if (!data.startDate?.trim()) {
      errors.push("Start date is required");
    }

    if (!data.endDate?.trim()) {
      errors.push("End date is required");
    }

    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errors.push("Invalid date format");
      } else if (startDate >= endDate) {
        errors.push("End date must be after start date");
      }
    }

    if (data.discountValue < 0) {
      errors.push("Discount value must be positive");
    }

    if (data.maxUses && data.maxUses < 1) {
      errors.push("Max uses must be at least 1");
    }

    return errors;
  };

  // Helper functions for promotion status
  const getPromotionStatus = (promotion: Promotion): string => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return "inactive";
    }

    if (startDate > now) {
      return "upcoming";
    }

    if (endDate < now) {
      return "expired";
    }

    return "active";
  };

  const getPromotionStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "green";
      case "upcoming":
        return "blue";
      case "expired":
        return "gray";
      case "inactive":
        return "red";
      default:
        return "gray";
    }
  };

  // Sync autoPromotions with promotions ref when it changes
  watch(
    autoPromotions,
    (newPromotions) => {
      if (newPromotions && newPromotions.length > 0) {
        promotions.value = newPromotions;
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
    // State
    promotions: readonly(promotions),
    statistics: readonly(statistics),
    pagination: readonly(pagination),
    loading: readonly(loading),
    creating: readonly(creating),
    updating: readonly(updating),
    deleting: readonly(deleting),

    // Auto-loaded data (computedAsync)
    autoPromotions: readonly(autoPromotions),
    autoStatistics: readonly(autoStatistics),

    // Computed
    totalPromotions,
    activePromotions,
    currentPromotions,
    upcomingPromotions,

    // Constants
    DISCOUNT_TYPES,

    // Methods
    listPromotions,
    getStatistics,
    createPromotion,
    updatePromotion,
    deletePromotion,
    getPromotion,
    initializePromotions,
    validatePromotionData,
    getPromotionStatus,
    getPromotionStatusColor,
  };
};
