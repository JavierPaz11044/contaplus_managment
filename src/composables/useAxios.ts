let interceptorsConfigured = false;

export const useAxios = () => {
  const { $api } = useNuxtApp();

  // Only configure interceptors once and only on client side
  if (!interceptorsConfigured && import.meta.client) {
    const { getIdToken } = useAuth();

    // Request interceptor to add auth token
    $api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getIdToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to get auth token:", error);
          // Continue with request even if token fails
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    $api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          console.error("Authentication failed");
          // Could redirect to login here if needed
        }
        return Promise.reject(error);
      }
    );

    interceptorsConfigured = true;
    console.log("[useAxios] Interceptors configured");
  }

  return {
    api: $api,
  };
};
