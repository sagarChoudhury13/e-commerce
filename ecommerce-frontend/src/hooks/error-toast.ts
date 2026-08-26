import { toast } from "@/components/ui/toast";

// Map your backend error codes to user-friendly messages
const ERROR_MESSAGE: Record<string | number, { title: string; description: string }> = {
  101: {
    title: "Account Already Exists",
    description: "An account with this email already exists. Please log in instead.",
  },
  102: {
    title: "Account Not Found",
    description: "No account exists with this email address. Please sign up.",
  },
  103: {
    title: "Incorrect Password",
    description: "The password you entered is incorrect. Please try again.",
  },
  104: {
    title: "Server Error",
    description: "An unexpected server error occurred. Please try again later.",
  },
  105: {
    title: "Invalid Information",
    description: "Some of the data provided was invalid. Please check your inputs.",
  },
  106: {
    title: "Unauthorized Access",
    description: "Your session has expired or you do not have permission. Please log in.",
  },
  107: {
    title: "Product Not Found",
    description: "This product is no longer available or does not exist.",
  },
  108: {
    title: "Address Not Found",
    description: "We could not find the specified delivery address.",
  },
  109: {
    title: "Invalid Address",
    description: "This address does not belong to your account.",
  },
  110: {
    title: "Order Not Found",
    description: "We could not locate this order in our system.",
  },
  111: {
    title: "Order Update Failed",
    description: "This order has already been cancelled and cannot be changed.",
  }
};

export function useErrorToast() {

  const showErrorToast = (errorCode?: string | number, defaultMessage?: string) => {
    // Look up the error code in our dictionary
    const errorData = errorCode ? ERROR_MESSAGE[errorCode] : null;

    if (errorData) {
      // If we recognize the code, show the specific message
      toast.add({
        type: "error",
        title: errorData.title,
        description: errorData.description,
      });
    } else {
      // If it's a code we haven't mapped yet, show a generic fallback
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: defaultMessage || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return { showErrorToast };
}