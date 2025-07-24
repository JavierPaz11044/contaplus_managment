<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 py-12"
  >
    <div class="max-w-2xl w-full space-y-8 p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <div
          class="mx-auto h-20 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-6"
        >
          <svg
            class="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-blue-900 mb-2">Join ContaPlus</h1>
        <p class="text-blue-600 text-sm font-medium">
          Register as a Seller Partner
        </p>
        <p class="text-blue-500 text-xs mt-1">
          Complete your company profile to get started
        </p>
      </div>

      <!-- Registration Form -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 space-y-8"
      >
        <FormKit
          type="form"
          v-model="registrationForm"
          @submit="handleRegister"
          :actions="false"
          form-class="space-y-8"
        >
          <!-- Personal Information Section -->
          <div class="space-y-6">
            <h2
              class="text-2xl font-semibold text-blue-900 border-b border-blue-200 pb-2"
            >
              Personal Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                validation="required|length:2,50"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />

              <FormKit
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                validation="required|length:2,50"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                validation="required|email"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />

              <FormKit
                type="tel"
                name="telephone"
                label="Phone Number"
                placeholder="Enter your phone number"
                validation="required|length:8,15"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="password"
                name="password"
                label="Password"
                placeholder="Create a secure password"
                validation="required|length:8,50"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />

              <FormKit
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                validation="required|confirm:password"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />
            </div>
          </div>

          <!-- Company Information Section -->
          <div class="space-y-6">
            <h2
              class="text-2xl font-semibold text-blue-900 border-b border-blue-200 pb-2"
            >
              Company Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="companyName"
                label="Company Name"
                placeholder="Enter company name"
                validation="required|length:2,100"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />

              <FormKit
                type="text"
                name="companyRuc"
                label="RUC"
                placeholder="Enter company RUC"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="email"
                name="companyCorporateEmail"
                label="Corporate Email"
                placeholder="company@domain.com"
                validation="required|email"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />

              <FormKit
                type="tel"
                name="companyPhone"
                label="Company Phone"
                placeholder="Enter company phone"
                validation="required|length:8,15"
                :disabled="isLoading"
                input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                label-class="block text-sm font-medium text-blue-700 mb-2"
              />
            </div>

            <FormKit
              type="textarea"
              name="companyAddress"
              label="Company Address"
              placeholder="Enter complete company address"
              validation="required|length:10,200"
              :disabled="isLoading"
              input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30 resize-none"
              label-class="block text-sm font-medium text-blue-700 mb-2"
              rows="3"
            />

            <FormKit
              type="select"
              name="companyIndustry"
              label="Industry"
              placeholder="Select your industry"
              validation="required"
              :disabled="isLoading"
              :options="industryOptions"
              input-class="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
              label-class="block text-sm font-medium text-blue-700 mb-2"
            />
          </div>

          <!-- Terms and Submit -->
          <div class="space-y-6">
            <FormKit
              type="checkbox"
              name="agreeToTerms"
              label="I agree to the Terms of Service and Privacy Policy"
              validation="required"
              :disabled="isLoading"
              input-class="h-4 w-4 text-blue-500 focus:ring-blue-400 border-blue-300 rounded"
              label-class="ml-2 block text-sm text-blue-700"
              wrapper-class="flex items-center"
            />

            <FormKit
              type="submit"
              :disabled="isLoading"
              input-class="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              {{ isLoading ? "Creating Account..." : "Create Seller Account" }}
            </FormKit>
          </div>
        </FormKit>

        <!-- Login Link -->
        <div class="text-center pt-6 border-t border-blue-200">
          <p class="text-sm text-blue-600">
            Already have an account?
            <NuxtLink
              to="/"
              class="font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-xs text-blue-500">
        <p>&copy; 2024 ContaPlus Administration Demo. All rights reserved.</p>
        <div class="mt-2 space-x-4">
          <span class="text-blue-400">Seller Registration</span>
          <span class="text-blue-400">•</span>
          <span class="text-blue-400">Secure & Encrypted</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "~/composables/useToast";

// Page metadata
definePageMeta({
  layout: false,
});

// Composables
const { showToast } = useToast();
const router = useRouter();

// Form data
const registrationForm = ref({
  // Personal data
  firstName: "",
  lastName: "",
  email: "",
  telephone: "",
  password: "",
  confirmPassword: "",

  // Company data
  companyName: "",
  companyRuc: "",
  companyCorporateEmail: "",
  companyPhone: "",
  companyAddress: "",
  companyIndustry: "",

  // Terms
  agreeToTerms: false,
});

// Component state
const isLoading = ref(false);

// Industry options for select
const industryOptions = [
  { label: "Technology", value: "technology" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Retail", value: "retail" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Financial Services", value: "financial" },
  { label: "Education", value: "education" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Food & Beverage", value: "food-beverage" },
  { label: "Transportation", value: "transportation" },
  { label: "Construction", value: "construction" },
  { label: "Consulting Services", value: "consulting" },
  { label: "Other", value: "other" },
];

// Handle registration submission
const handleRegister = async (formData: typeof registrationForm.value) => {
  console.log("handleRegister", formData);

  if (!formData.agreeToTerms) {
    showToast("Please accept the terms and conditions", "error");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  isLoading.value = true;

  try {
    // Use $fetch to register the seller
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        // Personal data
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        telephone: formData.telephone,

        // Company data
        companyName: formData.companyName,
        companyRuc: formData.companyRuc,
        companyCorporateEmail: formData.companyCorporateEmail,
        companyPhone: formData.companyPhone,
        companyAddress: formData.companyAddress,
        companyIndustry: formData.companyIndustry,
      },
    });

    if (response) {
      showToast(
        "Account created successfully! Please sign in to continue.",
        "success"
      );

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);

    let message = "Registration failed. Please try again.";

    if (error && typeof error === "object" && "data" in error) {
      const errorData = error.data as { statusMessage?: string };
      message = errorData.statusMessage || message;
    }

    showToast(message, "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Enhanced soft blue theme styles */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced focus styles with soft blue theme */
input:focus,
textarea:focus,
select:focus {
  --tw-ring-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width))
    rgba(59, 130, 246, 0.3);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);
}

/* Button hover animations */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Form sections spacing */
.space-y-8 > * + * {
  margin-top: 2rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1);
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}
</style>
