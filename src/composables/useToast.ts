import type { ToastType } from "vue3-toastify";

export const useToast = () => {
  const { $toast } = useNuxtApp();

  const showToast = (message: string, type: ToastType) => {
    $toast(message, {
      type,
    });
  };

  return { showToast };
};
