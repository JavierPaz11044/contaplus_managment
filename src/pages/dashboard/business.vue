<template>
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <img
            src="/assets/img/logo.jpeg"
            alt="ContaPlus Logo"
            class="w-12 h-12 mr-4 rounded-lg shadow-sm"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mi Negocio</h1>
            <p class="text-gray-600">
              Información de tu empresa y código QR para acceso rápido
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Business Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-xl font-semibold text-gray-900 mb-6 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2H3a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            Información de la Empresa
          </h2>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nombre de la Empresa</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.name || "No disponible" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >RUC</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.ruc || "No disponible" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Correo Corporativo</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.corporateEmail || "No disponible" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Teléfono</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.phone || "No disponible" }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Dirección</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.address || "No disponible" }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Industria</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.company?.industry || "No disponible" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-xl font-semibold text-gray-900 mb-6 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-blue-600"
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
            Información del Usuario
          </h2>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nombre Completo</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.user?.firstName }}
                  {{ businessInfo.user?.lastName }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Correo</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.user?.email }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Teléfono</label
                >
                <p class="text-gray-900 font-medium">
                  {{ businessInfo.user?.telephone || "No disponible" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Rol</label
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ businessInfo.user?.role || "seller" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        <div class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2
            class="text-xl font-semibold text-gray-900 mb-6 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
              ></path>
            </svg>
            Código QR de Acceso
          </h2>

          <div
            class="flex flex-col lg:flex-row items-center lg:items-start gap-8"
          >
            <!-- QR Code Display -->
            <div class="flex flex-col items-center">
              <div class="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <canvas ref="qrCanvas" class="w-48 h-48"></canvas>
              </div>
              <p class="text-sm text-gray-600 mt-2 text-center max-w-xs">
                Escanea este código QR desde tu móvil para acceder rápidamente a
                la información del negocio
              </p>
            </div>

            <!-- QR Information -->
            <div class="flex-1 space-y-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Información Codificada
                </h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <pre class="text-sm text-gray-700 overflow-x-auto">{{
                    qrData
                  }}</pre>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >ID de la Empresa</label
                  >
                  <p class="text-gray-900 font-mono text-sm">
                    {{ businessInfo.company?.id || "No disponible" }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >ID del Usuario</label
                  >
                  <p class="text-gray-900 font-mono text-sm">
                    {{ businessInfo.user?.id || "No disponible" }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <button
                  @click="downloadQR"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Descargar QR
                </button>
                <button
                  @click="printQR"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    ></path>
                  </svg>
                  Imprimir QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// User session
const { user } = useUserSession();

// QR canvas reference
const qrCanvas = ref<HTMLCanvasElement>();

// Business information from session
const businessInfo = computed(() => {
  if (!user.value) {
    return {
      company: null,
      user: null,
    };
  }

  const userData = user.value as {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone?: string;
    role: string;
    company?: {
      id: string;
      name: string;
      ruc: string;
      corporateEmail: string;
      phone: string;
      address: string;
      industry: string;
    };
  };

  return {
    company: userData.company,
    user: {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      telephone: userData.telephone,
      role: userData.role,
    },
  };
});

// QR data in JSON format
const qrData = computed(() => {
  if (!businessInfo.value.company?.id || !businessInfo.value.user?.id) {
    return "{}";
  }

  const baseUrl = window.location.origin;

  return JSON.stringify(
    {
      companyId: businessInfo.value.company.id,
      userId: businessInfo.value.user.id,
      companyName: businessInfo.value.company.name,
      userEmail: businessInfo.value.user.email,
      endpoints: {
        companyInfo: `${baseUrl}/api/public/company/${businessInfo.value.company.id}`,
        products: `${baseUrl}/api/public/company/${businessInfo.value.company.id}/products`,
        // Product detail endpoint will be: /api/public/product/{productId}
      },
    },
    null,
    2
  );
});

// Generate QR code
const generateQR = async () => {
  if (!qrCanvas.value || !qrData.value) return;

  try {
    // Dynamic import to avoid SSR issues
    const QRCode = await import("qrcode");
    await QRCode.default.toCanvas(qrCanvas.value, qrData.value, {
      width: 192,
      margin: 2,
      color: {
        dark: "#1f2937",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

// Download QR as image
const downloadQR = () => {
  if (!qrCanvas.value) return;

  const link = document.createElement("a");
  link.download = `contaplus-qr-${
    businessInfo.value.company?.id || "business"
  }.png`;
  link.href = qrCanvas.value.toDataURL();
  link.click();
};

// Print QR
const printQR = () => {
  if (!qrCanvas.value) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const qrImage = qrCanvas.value.toDataURL();

  printWindow.document.write(`
    <html>
      <head>
        <title>ContaPlus QR Code</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 20px; 
          }
          .qr-container { 
            display: inline-block; 
            padding: 20px; 
            border: 1px solid #ccc; 
            border-radius: 8px; 
          }
          .company-info { 
            margin-top: 20px; 
            font-size: 14px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h2>Contaplus - Código QR</h2>
          <img src="${qrImage}" alt="QR Code" style="width: 200px; height: 200px;" />
          <div class="company-info">
            <p><strong>Empresa:</strong> ${
              businessInfo.value.company?.name || "N/A"
            }</p>
            <p><strong>RUC:</strong> ${
              businessInfo.value.company?.ruc || "N/A"
            }</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

// Generate QR on mount
onMounted(() => {
  // Only generate QR on client side
  if (import.meta.client) {
    generateQR();
  }
});
</script>
