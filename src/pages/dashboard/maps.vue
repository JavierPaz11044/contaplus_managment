<template>
  <NuxtLayout name="dashboard">
    <!-- Top Header -->
    <header class="bg-white shadow-sm border-b border-slate-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h2
            class="text-3xl font-bold text-slate-800 capitalize flex items-center"
          >
            <div class="p-2 bg-blue-100 rounded-lg mr-4">
              <svg
                class="w-6 h-6 text-blue-600"
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
            Location Management
          </h2>
          <p class="text-slate-600 mt-1">
            Track and manage your business locations
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center bg-slate-100 rounded-xl px-4 py-2">
            <svg
              class="w-5 h-5 text-slate-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-sm text-slate-600">{{ currentTime }}</span>
          </div>
          <button
            class="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5 5v-5z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="p-8">
      <div class="space-y-8">
        <!-- Location Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">
                  Total Locations
                </p>
                <p class="text-3xl font-bold text-slate-800 mt-2">0</p>
              </div>
              <div class="bg-blue-100 rounded-xl p-3">
                <svg
                  class="w-6 h-6 text-blue-600"
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
            </div>
            <div class="flex items-center mt-4">
              <span class="text-green-500 text-sm font-medium">+0%</span>
              <span class="text-slate-500 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">Active Zones</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">0</p>
              </div>
              <div class="bg-green-100 rounded-xl p-3">
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-green-500 text-sm font-medium">+0%</span>
              <span class="text-slate-500 text-sm ml-2">coverage area</span>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">Cities</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">0</p>
              </div>
              <div class="bg-purple-100 rounded-xl p-3">
                <svg
                  class="w-6 h-6 text-purple-600"
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
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-blue-500 text-sm font-medium">Nationwide</span>
              <span class="text-slate-500 text-sm ml-2">presence</span>
            </div>
          </div>
        </div>

        <!-- Location Map -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div class="px-8 py-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-slate-800">
                  Location Management
                </h3>
                <p class="text-slate-600 mt-1">
                  Track and manage your business presence
                </p>
              </div>
              <button
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-medium flex items-center"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Location
              </button>
            </div>
          </div>
          <div class="p-8">
            <div class="text-center py-16">
              <div class="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <svg
                  class="w-12 h-12 text-slate-400"
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
              <h4 class="text-xl font-semibold text-slate-700 mb-2">
                No locations mapped
              </h4>
              <p class="text-slate-500 mb-6">
                Start tracking your business presence by adding your first
                location
              </p>
              <button
                class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium"
              >
                Add First Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Reactive state
const currentTime = ref("");

// Update current time
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Initialize
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});

// Set page title
useHead({
  title: "Locations - ContaPlus Dashboard",
});
</script>
