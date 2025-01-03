import { toaster } from "@/components/ui/toaster";
import { CommonToastProps } from "@/utils";

const useCommonToast = () => {
  const showToast = ({ description, type, loading }: CommonToastProps) => {
    toaster.create({
      description,
      type: type || (loading ? "loading" : undefined),
    });
  };

  return { showToast };
};

export default useCommonToast;
