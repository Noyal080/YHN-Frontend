// src/utils/toast.ts

import { toaster } from "@/components/ui/toaster";

export const showErrorToast = (message: string) => {
  toaster.create({
    title: "Error",
    description: message,
    type: "error",
    duration: 5000,
  });
};
