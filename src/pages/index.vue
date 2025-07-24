<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100"
  >
    <div class="max-w-md w-full space-y-8 p-8">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-blue-900 mb-2">ContaPlus</h1>
        <p class="text-blue-600 text-sm font-medium">
          Administration Demo System
        </p>
        <p class="text-blue-500 text-xs mt-1">Seller Management Platform</p>
      </div>

      <!-- Login Form -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 space-y-6"
      >
        <div class="space-y-6">
          <h2 class="text-2xl font-semibold text-blue-900 text-center">
            Sign In
          </h2>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Email Input -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-blue-700 mb-2"
              >
                Email Address
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    ></path>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  v-model="loginForm.email"
                  class="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                  placeholder="Enter your email"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-blue-700 mb-2"
              >
                Password
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="loginForm.password"
                  class="block w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-blue-50/30"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                  :disabled="isLoading"
                >
                  <svg
                    v-if="!showPassword"
                    class="h-5 w-5 text-blue-400"
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
                  <svg
                    v-else
                    class="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <button
                type="button"
                @click="handleForgotPassword"
                class="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                :disabled="isLoading"
              >
                Forgot password?
              </button>
            </div>

            <!-- Sign In Button -->
            <button
              type="submit"
              :disabled="isLoading || !loginForm.email || !loginForm.password"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
              {{ isLoading ? "Signing in..." : "Sign In to ContaPlus" }}
            </button>
          </form>
        </div>

        <!-- Seller Access Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-800 mb-2">
            Seller Access Portal
          </h3>
          <div class="flex items-center justify-center text-xs text-blue-600">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span>Exclusive Access for Registered Sellers</span>
            </div>
          </div>
        </div>

        <!-- Registration Link -->
        <div class="text-center pt-6 border-t border-blue-200">
          <p class="text-sm text-blue-600">
            New to ContaPlus?
            <NuxtLink
              to="/register"
              class="font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              Register as a Seller
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-xs text-blue-500">
        <p>&copy; 2024 ContaPlus Administration Demo. All rights reserved.</p>
        <div class="mt-2 space-x-4">
          <span class="text-blue-400">Version 1.0</span>
          <span class="text-blue-400">•</span>
          <span class="text-blue-400">Demo Environment</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast";

// Page metadata
definePageMeta({
  layout: false,
});

// Composables
const { login, resetPassword } = useAuth();
const { showToast } = useToast();
const router = useRouter();

// Reactive form data
const loginForm = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

// Component state
const showPassword = ref(false);
const isLoading = ref(false);

// Handle login submission
const handleLogin = async () => {
  console.log("handleLogin");
  if (!loginForm.email || !loginForm.password) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  isLoading.value = true;

  try {
    // Use the login function from useAuth composable
    const user = await login({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (user) {
      showToast("Welcome back! Redirecting to dashboard...", "success");

      // Redirect to seller dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  } catch (error: unknown) {
    console.error("Login error:", error);

    // Handle different types of Firebase auth errors
    let message = "Login failed. Please try again.";

    if (error && typeof error === "object" && "code" in error) {
      const firebaseError = error as { code: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          message = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address format.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Please try again later.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;
        default:
          message =
            firebaseError.message || "Authentication failed. Please try again.";
      }
    }

    showToast(message, "error");
  } finally {
    isLoading.value = false;
  }
};

// Handle forgot password
const handleForgotPassword = async () => {
  if (!loginForm.email) {
    showToast("Please enter your email address first.", "error");
    return;
  }

  try {
    isLoading.value = true;
    await resetPassword(loginForm.email);
    showToast("Password reset email sent! Please check your inbox.", "success");
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    showToast("Failed to send reset email. Please try again.", "error");
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
input:focus {
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

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>
