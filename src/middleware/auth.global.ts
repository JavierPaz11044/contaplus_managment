export default defineNuxtRouteMiddleware((to, _from) => {
  // Skip middleware for API routes
  if (to.path.startsWith("/api/")) {
    return;
  }

  const { user } = useUserSession();
  const userData = user.value as {
    role: string;
    isActive: boolean;
  } | null;

  if (to.path === "/") {
    if (userData && userData.role === "seller" && userData.isActive) {
      return navigateTo("/dashboard");
    }
    return;
  }

  if (to.path === "/register") {
    if (userData && userData.role === "seller" && userData.isActive) {
      return navigateTo("/dashboard");
    }
    return;
  }

  // Handle dashboard routes for authenticated sellers
  if (to.path.startsWith("/dashboard")) {
    // Redirect /dashboard to /dashboard/products as default
    if (to.path === "/dashboard") {
      return navigateTo("/dashboard/products");
    }
    // User is already authenticated and verified as active seller at this point
    return;
  }

  if (!userData) {
    return navigateTo("/");
  }

  if (userData.role !== "seller" || !userData.isActive) {
    console.log("Access denied: User is not an active seller");
    return navigateTo("/");
  }
});
