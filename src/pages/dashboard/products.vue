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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
            </div>
            Product Management
          </h2>
          <p class="text-slate-600 mt-1">
            Manage your product inventory and catalog
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
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">Total Products</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">
                  {{ totalProducts }}
                </p>
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
                <p class="text-slate-600 text-sm font-medium">Active Items</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">
                  {{ activeProducts }}
                </p>
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
              <span class="text-slate-500 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">Categories</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">
                  {{ totalCategories }}
                </p>
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
                <p class="text-slate-600 text-sm font-medium">Low Stock</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">
                  {{ lowStockProducts }}
                </p>
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.118 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4">
              <span class="text-orange-500 text-sm font-medium">Alert</span>
              <span class="text-slate-500 text-sm ml-2"
                >requires attention</span
              >
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div class="px-8 py-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-slate-800">
                  Product Catalog
                </h3>
                <p class="text-slate-600 mt-1">Manage your product inventory</p>
              </div>
              <button
                @click="openCreateModal"
                :disabled="creating"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!creating"
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
                <svg
                  v-else
                  class="animate-spin w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ creating ? "Creating..." : "Add Product" }}
              </button>
            </div>
          </div>
          <div class="p-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-16">
              <div class="animate-spin w-12 h-12 mx-auto mb-4 text-blue-500">
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p class="text-slate-600">Loading products...</p>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="!products || products.length === 0"
              class="text-center py-16"
            >
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-slate-700 mb-2">
                No products yet
              </h4>
              <p class="text-slate-500 mb-6">
                Start building your product catalog by adding your first product
              </p>
              <button
                @click="openCreateModal"
                class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium"
              >
                Get Started
              </button>
            </div>

            <!-- Products Table -->
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-200">
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Product
                    </th>
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Category
                    </th>
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Price
                    </th>
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Stock
                    </th>
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Status
                    </th>
                    <th
                      class="text-left py-4 px-6 font-semibold text-slate-700"
                    >
                      Created
                    </th>
                    <th
                      class="text-right py-4 px-6 font-semibold text-slate-700"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="product in products"
                    :key="product.id"
                    class="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td class="py-4 px-6">
                      <div>
                        <p class="font-semibold text-slate-800">
                          {{ product.name }}
                        </p>
                        <p class="text-sm text-slate-500">
                          SKU: {{ product.sku }}
                        </p>
                        <p class="text-sm text-slate-500 mt-1">
                          {{ product.description.substring(0, 60)
                          }}{{ product.description.length > 60 ? "..." : "" }}
                        </p>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {{ getCategoryLabel(product.category) }}
                      </span>
                    </td>
                    <td class="py-4 px-6">
                      <span class="font-semibold text-slate-800">{{
                        formatCurrency(product.price)
                      }}</span>
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex items-center">
                        <span
                          class="font-semibold"
                          :class="
                            product.quantity <= product.stockAlert
                              ? 'text-orange-600'
                              : 'text-slate-800'
                          "
                        >
                          {{ product.quantity }}
                        </span>
                        <svg
                          v-if="product.quantity <= product.stockAlert"
                          class="w-4 h-4 text-orange-500 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.118 16.5c-.77.833.192 2.5 1.732 2.5z"
                          ></path>
                        </svg>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        :class="
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        "
                      >
                        {{ product.isActive ? "Active" : "Inactive" }}
                      </span>
                    </td>
                    <td class="py-4 px-6">
                      <span class="text-slate-600">
                        {{
                          product.createdAt
                            ? formatDate(product.createdAt)
                            : "N/A"
                        }}
                      </span>
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex items-center justify-end space-x-2">
                        <!-- Edit Button -->
                        <button
                          @click="openEditModal(product)"
                          :disabled="updating === product.id"
                          class="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit product"
                        >
                          <svg
                            v-if="updating !== product.id"
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                          <svg
                            v-else
                            class="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </button>

                        <!-- Delete Button -->
                        <button
                          @click="handleDeleteProduct(product.id, product.name)"
                          :disabled="deleting === product.id"
                          class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete product"
                        >
                          <svg
                            v-if="deleting !== product.id"
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          <svg
                            v-else
                            class="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Product Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeCreateModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-slate-800">Add New Product</h3>
            <button
              @click="closeCreateModal"
              class="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <svg
                class="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleCreateProduct" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name *
                </label>
                <input
                  v-model="productForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product name"
                />
              </div>

              <!-- SKU -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  SKU *
                  <span
                    v-if="isSkuAutoGenerated"
                    class="text-xs text-blue-600 font-normal ml-2"
                    >(Auto-generated)</span
                  >
                </label>
                <div class="relative">
                  <input
                    v-model="productForm.sku"
                    @input="handleSkuManualEdit"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="
                      isSkuAutoGenerated
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white'
                    "
                    placeholder="Auto-generated or enter custom SKU"
                  />
                  <button
                    v-if="!isSkuAutoGenerated"
                    @click="
                      autoGenerateSKU();
                      isSkuAutoGenerated = true;
                    "
                    type="button"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Regenerate SKU"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  {{
                    isSkuAutoGenerated
                      ? "SKU will update automatically as you type"
                      : "Custom SKU - click refresh to auto-generate"
                  }}
                </p>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  v-model="productForm.category"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  <option
                    v-for="category in PRODUCT_CATEGORIES"
                    :key="category.value"
                    :value="category.value"
                  >
                    {{ category.label }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Price *
                </label>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Quantity *
                </label>
                <input
                  v-model.number="productForm.quantity"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>

              <!-- Stock Alert -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Stock Alert Level
                </label>
                <input
                  v-model.number="productForm.stockAlert"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="10"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                v-model="productForm.description"
                required
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter product description"
              ></textarea>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                v-model="productForm.isActive"
                type="checkbox"
                id="isActive"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                for="isActive"
                class="ml-3 text-sm font-semibold text-slate-700"
              >
                Product is active
              </label>
            </div>

            <!-- Form Actions -->
            <div
              class="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200"
            >
              <button
                type="button"
                @click="closeCreateModal"
                class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ creating ? "Creating..." : "Create Product" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeEditModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-slate-800">Edit Product</h3>
            <button
              @click="closeEditModal"
              class="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <svg
                class="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleUpdateProduct" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name *
                </label>
                <input
                  v-model="editForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product name"
                />
              </div>

              <!-- SKU -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  SKU *
                </label>
                <input
                  v-model="editForm.sku"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product SKU"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  v-model="editForm.category"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  <option
                    v-for="category in PRODUCT_CATEGORIES"
                    :key="category.value"
                    :value="category.value"
                  >
                    {{ category.label }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Price *
                </label>
                <input
                  v-model.number="editForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Quantity *
                </label>
                <input
                  v-model.number="editForm.quantity"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>

              <!-- Stock Alert -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Stock Alert Level
                </label>
                <input
                  v-model.number="editForm.stockAlert"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="10"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                v-model="editForm.description"
                required
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter product description"
              ></textarea>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                v-model="editForm.isActive"
                type="checkbox"
                id="editIsActive"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                for="editIsActive"
                class="ml-3 text-sm font-semibold text-slate-700"
              >
                Product is active
              </label>
            </div>

            <!-- Form Actions -->
            <div
              class="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200"
            >
              <button
                type="button"
                @click="closeEditModal"
                class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updating === editingProductId"
                class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  updating === editingProductId
                    ? "Updating..."
                    : "Update Product"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ProductFormData, Product } from "~/composables/useProducts";

// Composables
const {
  products,
  loading,
  creating,
  updating,
  deleting,
  totalProducts,
  activeProducts,
  lowStockProducts,
  totalCategories,
  PRODUCT_CATEGORIES,
  initializeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryLabel,
} = useProducts();

// Reactive state
const currentTime = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingProductId = ref<string | null>(null);

const productForm = ref<ProductFormData>({
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  sku: "",
  category: "",
  stockAlert: 10,
  isActive: true,
});

const editForm = ref<ProductFormData>({
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  sku: "",
  category: "",
  stockAlert: 10,
  isActive: true,
});

// Update current time
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
const formatDate = (date: Date | string | null | undefined) => {
  // Debug logging - remove this after fixing
  console.log("🔍 [FORMAT-DATE] Input:", { date, type: typeof date });

  try {
    // Handle null, undefined, or empty values
    if (!date) {
      console.log("🔍 [FORMAT-DATE] Null/undefined date, returning N/A");
      return "N/A";
    }

    // Convert to Date object
    let d: Date;
    if (typeof date === "string") {
      // Handle empty string or invalid string
      if (date.trim() === "") {
        console.log("🔍 [FORMAT-DATE] Empty string, returning N/A");
        return "N/A";
      }
      console.log("🔍 [FORMAT-DATE] Converting string to date:", date);
      d = new Date(date);
    } else {
      console.log("🔍 [FORMAT-DATE] Using date object directly");
      d = date;
    }

    // Check if date is valid
    if (isNaN(d.getTime())) {
      console.warn("⚠️ [PRODUCTS-UI] Invalid date received:", {
        original: date,
        parsed: d,
      });
      return "Invalid Date";
    }

    const formatted = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);

    console.log("🔍 [FORMAT-DATE] Successfully formatted:", formatted);
    return formatted;
  } catch (error) {
    console.error(
      "💥 [PRODUCTS-UI] Error formatting date:",
      error,
      "Date value:",
      date
    );
    return "Error";
  }
};

// Generate SKU automatically
const generateSKU = () => {
  const form = productForm.value;

  if (!form.name.trim() && !form.category) {
    return "";
  }

  let sku = "";

  // Add category prefix (first 4 characters, uppercase)
  if (form.category) {
    const categoryLabel = getCategoryLabel(form.category);
    sku += categoryLabel.substring(0, 4).toUpperCase().replace(/\s/g, "");
  }

  // Add separator
  if (sku) sku += "-";

  // Add product name (first 2 words, no spaces, uppercase)
  if (form.name.trim()) {
    const nameWords = form.name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);
    const namePrefix = nameWords
      .slice(0, 2)
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    sku += namePrefix;
  }

  // Add timestamp suffix to ensure uniqueness
  if (sku) {
    const timestamp = Date.now().toString().slice(-4);
    sku += "-" + timestamp;
  }

  return sku;
};

// Auto-generate SKU when name or category changes
const autoGenerateSKU = () => {
  if (!productForm.value.sku || isSkuAutoGenerated.value) {
    productForm.value.sku = generateSKU();
    isSkuAutoGenerated.value = true;
  }
};

// Track if SKU was auto-generated
const isSkuAutoGenerated = ref(true);

// Watch for changes in name and category
watch(() => productForm.value.name, autoGenerateSKU);
watch(() => productForm.value.category, autoGenerateSKU);

// Handle manual SKU edit
const handleSkuManualEdit = () => {
  isSkuAutoGenerated.value = false;
};

// Handle create product
const handleCreateProduct = async () => {
  try {
    console.log("🚀 [PRODUCTS-UI] Starting product creation...");

    // Ensure SKU is generated if empty
    if (!productForm.value.sku.trim()) {
      productForm.value.sku = generateSKU();
      console.log("🔧 [PRODUCTS-UI] Generated SKU:", productForm.value.sku);
    }

    // Create the product
    closeCreateModal();
    const createdProduct = await createProduct(productForm.value);

    console.log(
      "✅ [PRODUCTS-UI] Product created successfully, closing modal..."
    );

    // Debug: Log the created product's date fields
    console.log("🔍 [PRODUCTS-UI] Created product date fields:", {
      createdAt: createdProduct?.createdAt,
      updatedAt: createdProduct?.updatedAt,
      createdAtType: typeof createdProduct?.createdAt,
      updatedAtType: typeof createdProduct?.updatedAt,
    });

    // Reset form and close modal
    resetProductForm();

    await nextTick();
  } catch (error) {
    console.error("💥 [PRODUCTS-UI] Error creating product:", error);
    // Note: Error handling and user notification is done in the composable
    // Modal stays open so user can fix the error and try again
  }
};

// Reset product form to initial state
const resetProductForm = () => {
  productForm.value = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    sku: "",
    category: "",
    stockAlert: 10,
    isActive: true,
  };
  isSkuAutoGenerated.value = true;
  console.log("🔄 [PRODUCTS-UI] Product form reset");
};

// Close create modal
const closeCreateModal = () => {
  try {
    showCreateModal.value = false;
    console.log("❌ [PRODUCTS-UI] Create modal closed");

    // Safety timeout to ensure modal is closed
    setTimeout(() => {
      if (showCreateModal.value) {
        console.warn("⚠️ [PRODUCTS-UI] Modal still open, forcing close...");
        showCreateModal.value = false;
      }
    }, 100);
  } catch (error) {
    console.error("💥 [PRODUCTS-UI] Error closing modal:", error);
    // Force close even if there's an error
    showCreateModal.value = false;
  }
};

// Open create modal
const openCreateModal = () => {
  resetProductForm();
  showCreateModal.value = true;
  console.log("➕ [PRODUCTS-UI] Create modal opened");
};

// Open edit modal
const openEditModal = (product: Product) => {
  console.log("✏️ [PRODUCTS-UI] Opening edit modal for product:", product.id);

  editingProductId.value = product.id;
  editForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    sku: product.sku,
    category: product.category,
    stockAlert: product.stockAlert || 10,
    isActive: product.isActive,
  };

  showEditModal.value = true;
  console.log("✏️ [PRODUCTS-UI] Edit modal opened");
};

// Close edit modal
const closeEditModal = () => {
  console.log("❌ [PRODUCTS-UI] Closing edit modal...");
  showEditModal.value = false;
  editingProductId.value = null;
  console.log("✅ [PRODUCTS-UI] Edit modal closed");
};

// Handle update product
const handleUpdateProduct = async () => {
  if (!editingProductId.value) {
    console.error("💥 [PRODUCTS-UI] No product ID for editing");
    return;
  }

  try {
    console.log("🚀 [PRODUCTS-UI] Starting product update...");
    console.log("📝 [PRODUCTS-UI] Edit form data:", editForm.value);

    // Update the product
    const updatedProduct = await updateProduct(
      editingProductId.value,
      editForm.value
    );

    console.log(
      "✅ [PRODUCTS-UI] Product updated successfully:",
      updatedProduct?.id || "unknown"
    );

    // Close modal immediately
    closeEditModal();

    console.log("✅ [PRODUCTS-UI] Edit modal closed after update");
  } catch (error: unknown) {
    console.error("💥 [PRODUCTS-UI] Error updating product:", error);

    const err = error as {
      message?: string;
      response?: { data?: { statusMessage?: string }; status?: number };
    };

    // Show error to user - modal stays open so they can try again
    const errorMessage =
      err?.response?.data?.statusMessage ||
      err?.message ||
      "Failed to update product";
    alert(`Error updating product: ${errorMessage}`);
  }
};

// Handle delete product
const handleDeleteProduct = async (productId: string, productName: string) => {
  if (confirm(`Are you sure you want to delete "${productName}"?`)) {
    try {
      await deleteProduct(productId);
    } catch (error) {
      // Error handling is done in the composable
      console.error("Error deleting product:", error);
    }
  }
};

// Initialize
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  initializeProducts();
});

// Set page title
useHead({
  title: "Products - ContaPlus Dashboard",
});
</script>
