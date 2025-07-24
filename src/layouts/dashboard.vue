<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
    <!-- Sidebar -->
    <div
      class="w-72 bg-white shadow-xl fixed h-full left-0 top-0 z-20 border-r border-slate-200"
    >
      <!-- Logo/Header -->
      <div
        class="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700"
      >
        <div class="flex items-center">
          <div class="bg-white bg-opacity-20 rounded-xl p-3 mr-4">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">ContaPlus</h1>
            <p class="text-blue-100 text-sm">Professional Dashboard</p>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div
        class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50"
      >
        <div class="flex items-center">
          <div class="bg-blue-500 rounded-full p-3 mr-4 shadow-lg">
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-800 text-lg">
              {{ userInfo.firstName }} {{ userInfo.lastName }}
            </p>
            <p class="text-slate-600 text-sm flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              {{ userInfo.company?.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="py-6">
        <div class="px-6 mb-6">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
        </div>

        <!-- Products Button -->
        <NuxtLink
          to="/dashboard/products"
          :class="[
            'w-full flex items-center px-6 py-4 text-left transition-all duration-300 group relative',
            $route.path.includes('/dashboard/products')
              ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
              : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
          ]"
        >
          <div
            :class="[
              'p-2 rounded-lg mr-4 transition-colors duration-300',
              $route.path.includes('/dashboard/products')
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600',
            ]"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">Products</p>
            <p class="text-xs text-slate-500">Manage inventory</p>
          </div>
        </NuxtLink>

        <!-- Maps Button -->
        <NuxtLink
          to="/dashboard/maps"
          :class="[
            'w-full flex items-center px-6 py-4 text-left transition-all duration-300 group relative',
            $route.path.includes('/dashboard/maps')
              ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
              : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
          ]"
        >
          <div
            :class="[
              'p-2 rounded-lg mr-4 transition-colors duration-300',
              $route.path.includes('/dashboard/maps')
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600',
            ]"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">Locations</p>
            <p class="text-xs text-slate-500">Track presence</p>
          </div>
        </NuxtLink>

        <!-- Promotions Button -->
        <NuxtLink
          to="/dashboard/promotions"
          :class="[
            'w-full flex items-center px-6 py-4 text-left transition-all duration-300 group relative',
            $route.path.includes('/dashboard/promotions')
              ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
              : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50',
          ]"
        >
          <div
            :class="[
              'p-2 rounded-lg mr-4 transition-colors duration-300',
              $route.path.includes('/dashboard/promotions')
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600',
            ]"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">Promotions</p>
            <p class="text-xs text-slate-500">Marketing campaigns</p>
          </div>
        </NuxtLink>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-6 left-6 right-6">
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-medium"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          Sign Out
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 ml-72">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const { logout } = useAuth();
const { showToast } = useToast();

// User info from session
const userInfo = computed(() => {
  const userData = user.value as {
    firstName?: string;
    lastName?: string;
    company?: { name?: string };
  };
  return (
    userData || {
      firstName: "User",
      lastName: "",
      company: { name: "Company" },
    }
  );
});

// Handle logout
const handleLogout = async () => {
  try {
    await logout();
    showToast("Logged out successfully", "success");
    await navigateTo("/");
  } catch (error) {
    console.error("Logout error:", error);
    showToast("Error during logout", "error");
  }
};
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
