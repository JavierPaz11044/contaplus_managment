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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
            </div>
            Promotion Management
          </h2>
          <p class="text-slate-600 mt-1">
            Create and manage promotional campaigns
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
        <!-- Promotions Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">
                  Active Campaigns
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
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
                <p class="text-slate-600 text-sm font-medium">Total Reach</p>
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-green-500 text-sm font-medium">+0%</span>
              <span class="text-slate-500 text-sm ml-2">impressions</span>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">
                  Conversion Rate
                </p>
                <p class="text-3xl font-bold text-slate-800 mt-2">0%</p>
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-blue-500 text-sm font-medium">Performance</span>
              <span class="text-slate-500 text-sm ml-2">tracking</span>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">Budget Spent</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">$0</p>
              </div>
              <div class="bg-orange-100 rounded-xl p-3">
                <svg
                  class="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-orange-500 text-sm font-medium">Budget</span>
              <span class="text-slate-500 text-sm ml-2">utilization</span>
            </div>
          </div>
        </div>

        <!-- Promotions Campaign Management -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div class="px-8 py-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-slate-800">
                  Marketing Campaigns
                </h3>
                <p class="text-slate-600 mt-1">
                  Create and manage promotional campaigns
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
                Create Campaign
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  ></path>
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-slate-700 mb-2">
                No campaigns yet
              </h4>
              <p class="text-slate-500 mb-6">
                Start promoting your business by creating your first marketing
                campaign
              </p>
              <button
                class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium"
              >
                Launch Campaign
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
  title: "Promotions - ContaPlus Dashboard",
});
</script>
