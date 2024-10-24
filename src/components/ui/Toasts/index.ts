import { toast, ToasterProps } from "sonner";

type toastType = "success" | "info" | "warning" | "error" | "loading";

export const showToast = (
  text: string,
  type: toastType,
  options?: Partial<ToasterProps>
) => {
  const toastFn = toast[type];

  const toastOptions: ToasterProps = {
    position: "bottom-right",
    duration: 2000,
  };

  toastFn(text, {
    ...toastOptions,
    ...options,
  });
};
