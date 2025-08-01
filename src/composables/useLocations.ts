import { ref, computed, watch } from "vue";
import { computedAsync } from "@vueuse/core";

// Location interface
export interface Location {
  id: string;
  name: string;
  description: string;
  productId: string;
  zone: string;
  section: string;
  aisle?: string;
  shelf?: string;
  position: {
    x: number;
    y: number;
  };
  sellerId: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Location form data interface
export interface LocationFormData {
  name: string;
  description: string;
  productId: string;
  zone: string;
  section: string;
  aisle?: string;
  shelf?: string;
  position: {
    x: number;
    y: number;
  };
  isActive?: boolean;
  notes?: string;
}

// Statistics interface
export interface LocationStatistics {
  count: number;
  total: number;
  active: number;
  inactive: number;
  totalZones: number;
  totalSections: number;
  totalAisles: number;
  productsCovered: number;
  avgPosition: {
    x: number;
    y: number;
  };
  coverage: {
    zones: string[];
    sections: string[];
    aisles: string[];
  };
  healthScore: {
    activeRatio: number;
    coverageRatio: number;
  };
}

// Pagination interface
export interface LocationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Predefined zones for consistency
export const LOCATION_ZONES = [
  "Entrance",
  "Main Floor",
  "Upper Floor",
  "Basement",
  "Outdoor",
  "Storage",
  "Office",
  "Warehouse",
] as const;

// Predefined sections
export const LOCATION_SECTIONS = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Automotive",
  "Health & Beauty",
  "Tools",
] as const;

export const useLocations = () => {
  const { api } = useAxios();
  const { showToast } = useToast();
  const { getIdToken } = useAuth();

  // Helper function to process location dates
  const processLocationDates = (
    location: Record<string, unknown>
  ): Location => {
    return {
      ...location,
      createdAt: location.createdAt
        ? new Date(location.createdAt as string)
        : new Date(),
      updatedAt: location.updatedAt
        ? new Date(location.updatedAt as string)
        : new Date(),
    } as Location;
  };

  // Wait for authentication token to be available
  const waitForToken = async (): Promise<string | null> => {
    try {
      for (let i = 0; i < 5; i++) {
        try {
          const token = await getIdToken();
          if (token) {
            console.log("🔑 [LOCATIONS] Auth token obtained");
            return token;
          }
        } catch (error) {
          console.warn(`🔑 [LOCATIONS] Token attempt ${i + 1} failed:`, error);
        }

        if (i < 4) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.error("🔑 [LOCATIONS] Failed to obtain auth token after retries");
      return null;
    } catch (error) {
      console.error("🔑 [LOCATIONS] Error waiting for token:", error);
      return null;
    }
  };

  // Reactive state
  const locations = ref<Location[]>([]);
  const statistics = ref<LocationStatistics | null>(null);
  const pagination = ref<LocationPagination | null>(null);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref<string | null>(null);
  const deleting = ref<string | null>(null);

  // Computed properties
  const totalLocations = computed(
    () => autoStatistics.value?.total || statistics.value?.total || 0
  );
  const activeLocations = computed(
    () => autoStatistics.value?.active || statistics.value?.active || 0
  );
  const totalZones = computed(
    () => autoStatistics.value?.totalZones || statistics.value?.totalZones || 0
  );
  const totalSections = computed(
    () =>
      autoStatistics.value?.totalSections ||
      statistics.value?.totalSections ||
      0
  );

  // List locations
  const listLocations = async (page: number = 1, limit: number = 10) => {
    loading.value = true;
    try {
      console.log("🔍 [LOCATIONS] Fetching locations list");

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(`locations/?page=${page}&limit=${limit}`);

      const rawLocations = response.data.locations || [];
      const processedLocations = rawLocations.map(processLocationDates);

      locations.value = processedLocations;
      pagination.value = response.data.pagination || null;

      console.log("✅ [LOCATIONS] Locations loaded:", locations.value.length);
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error fetching locations:", error);
      showToast("Error loading locations", "error");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Get location statistics
  const getStatistics = async () => {
    try {
      console.log("📊 [LOCATIONS] Fetching statistics");

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get("locations/count");

      statistics.value = response.data.statistics;
      console.log("✅ [LOCATIONS] Statistics loaded:", statistics.value);
      return response.data;
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error fetching statistics:", error);
      showToast("Error loading statistics", "error");
      throw error;
    }
  };

  // Create location
  const createLocation = async (
    locationData: LocationFormData
  ): Promise<Location> => {
    creating.value = true;
    try {
      console.log("➕ [LOCATIONS] Creating location:", locationData.name);

      // Validate required fields
      if (!locationData.name?.trim()) {
        throw new Error("Location name is required");
      }
      if (!locationData.description?.trim()) {
        throw new Error("Location description is required");
      }
      if (!locationData.productId?.trim()) {
        throw new Error("Product ID is required");
      }
      if (!locationData.zone?.trim()) {
        throw new Error("Zone is required");
      }
      if (!locationData.section?.trim()) {
        throw new Error("Section is required");
      }

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.post("locations/", locationData);
      const rawLocation = response.data.location;

      const newLocation = processLocationDates(rawLocation);

      // Add to local locations list
      locations.value.unshift(newLocation);

      console.log("✅ [LOCATIONS] Location created:", newLocation.id);
      showToast("Location created successfully!", "success");

      // Refresh statistics
      await getStatistics();

      return newLocation;
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error creating location:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error creating location";
      showToast(message, "error");
      throw error;
    } finally {
      creating.value = false;
    }
  };

  // Update location
  const updateLocation = async (
    locationId: string,
    updateData: Partial<LocationFormData>
  ): Promise<Location> => {
    updating.value = locationId;
    try {
      console.log("✏️ [LOCATIONS] Updating location:", locationId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.put(`locations/${locationId}`, updateData);
      const rawLocation = response.data.location;

      const updatedLocation = processLocationDates(rawLocation);

      // Update in local locations list
      const index = locations.value.findIndex((l) => l.id === locationId);
      if (index !== -1) {
        locations.value[index] = updatedLocation;
      }

      console.log("✅ [LOCATIONS] Location updated:", locationId);
      showToast("Location updated successfully!", "success");

      return updatedLocation;
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error updating location:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error updating location";
      showToast(message, "error");
      throw error;
    } finally {
      updating.value = null;
    }
  };

  // Delete location
  const deleteLocation = async (locationId: string): Promise<void> => {
    deleting.value = locationId;
    try {
      console.log("🗑️ [LOCATIONS] Deleting location:", locationId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      await api.delete(`locations/${locationId}`);

      // Remove from local locations list
      locations.value = locations.value.filter((l) => l.id !== locationId);

      console.log("✅ [LOCATIONS] Location deleted:", locationId);
      showToast("Location deleted successfully!", "success");

      // Refresh statistics
      await getStatistics();
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error deleting location:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error deleting location";
      showToast(message, "error");
      throw error;
    } finally {
      deleting.value = null;
    }
  };

  // Get single location
  const getLocation = async (locationId: string): Promise<Location> => {
    try {
      console.log("🔍 [LOCATIONS] Fetching location:", locationId);

      const token = await waitForToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await api.get(`locations/${locationId}`);

      console.log("✅ [LOCATIONS] Location loaded:", locationId);
      return response.data.location;
    } catch (error: unknown) {
      console.error("💥 [LOCATIONS] Error fetching location:", error);
      const err = error as {
        response?: { data?: { statusMessage?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.statusMessage ||
        err.message ||
        "Error loading location";
      showToast(message, "error");
      throw error;
    }
  };

  // Auto-load locations with computedAsync
  const autoLocations = computedAsync(async () => {
    try {
      console.log("🔄 [LOCATIONS] Auto-loading locations...");
      const token = await waitForToken();
      if (!token) {
        console.warn("🔑 [LOCATIONS] No token available, skipping auto-load");
        return [];
      }

      const response = await api.get(`locations/?page=1&limit=50`);
      const rawLocations = response.data.locations || [];

      const loadedLocations = rawLocations.map(processLocationDates);

      pagination.value = response.data.pagination || null;

      console.log(
        "✅ [LOCATIONS] Auto-loaded locations:",
        loadedLocations.length
      );
      return loadedLocations;
    } catch (error) {
      console.error("💥 [LOCATIONS] Error auto-loading locations:", error);
      return [];
    }
  }, []);

  // Auto-load statistics with computedAsync
  const autoStatistics = computedAsync(async () => {
    try {
      console.log("📊 [LOCATIONS] Auto-loading statistics...");
      const token = await waitForToken();
      if (!token) {
        console.warn(
          "🔑 [LOCATIONS] No token available, skipping stats auto-load"
        );
        return null;
      }

      const response = await api.get("locations/count");
      const stats = response.data.statistics;

      console.log("✅ [LOCATIONS] Auto-loaded statistics:", stats);
      return stats;
    } catch (error) {
      console.error("💥 [LOCATIONS] Error auto-loading statistics:", error);
      return null;
    }
  }, null);

  // Initialize data (legacy method for manual loading)
  const initializeLocations = async () => {
    await Promise.all([listLocations(), getStatistics()]);
  };

  // Validation helpers
  const validateLocationData = (data: LocationFormData): string[] => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Location name is required");
    } else if (data.name.length > 100) {
      errors.push("Location name is too long (max 100 characters)");
    }

    if (!data.description?.trim()) {
      errors.push("Location description is required");
    } else if (data.description.length > 500) {
      errors.push("Location description is too long (max 500 characters)");
    }

    if (!data.productId?.trim()) {
      errors.push("Product ID is required");
    }

    if (!data.zone?.trim()) {
      errors.push("Zone is required");
    }

    if (!data.section?.trim()) {
      errors.push("Section is required");
    }

    if (data.position) {
      if (data.position.x < 0) {
        errors.push("X position must be positive");
      }
      if (data.position.y < 0) {
        errors.push("Y position must be positive");
      }
    }

    return errors;
  };

  // Sync autoLocations with locations ref when it changes
  watch(
    autoLocations,
    (newLocations) => {
      if (newLocations && newLocations.length > 0) {
        locations.value = newLocations;
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
    locations: readonly(locations),
    statistics: readonly(statistics),
    pagination: readonly(pagination),
    loading: readonly(loading),
    creating: readonly(creating),
    updating: readonly(updating),
    deleting: readonly(deleting),

    // Auto-loaded data (computedAsync)
    autoLocations: readonly(autoLocations),
    autoStatistics: readonly(autoStatistics),

    // Computed
    totalLocations,
    activeLocations,
    totalZones,
    totalSections,

    // Constants
    LOCATION_ZONES,
    LOCATION_SECTIONS,

    // Methods
    listLocations,
    getStatistics,
    createLocation,
    updateLocation,
    deleteLocation,
    getLocation,
    initializeLocations,
    validateLocationData,
  };
};
