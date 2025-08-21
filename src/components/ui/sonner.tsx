import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// Custom toast variants with proper colored backgrounds and white text
export const customToast = {
  success: (title: string, description?: string) => {
    return toast.success(title, {
      description,
      classNames: {
        toast: "!bg-green-600 !border-green-600 !text-white shadow-lg",
        title: "!text-white font-semibold",
        description: "!text-green-100",
        actionButton:
          "!bg-white !text-green-600 hover:!bg-green-50 font-medium",
        cancelButton: "!bg-green-700 !text-white hover:!bg-green-800",
      },
      duration: 5000,
    });
  },
  error: (title: string, description?: string) => {
    return toast.error(title, {
      description,
      classNames: {
        toast: "!bg-red-600 !border-red-600 !text-white shadow-lg",
        title: "!text-white font-semibold",
        description: "!text-red-100",
        actionButton: "!bg-white !text-red-600 hover:!bg-red-50 font-medium",
        cancelButton: "!bg-red-700 !text-white hover:!bg-red-800",
      },
      duration: 5000,
    });
  },
  warning: (title: string, description?: string) => {
    return toast.warning(title, {
      description,
      classNames: {
        toast: "!bg-amber-600 !border-amber-600 !text-white shadow-lg",
        title: "!text-white font-semibold",
        description: "!text-amber-100",
        actionButton:
          "!bg-white !text-amber-600 hover:!bg-amber-50 font-medium",
        cancelButton: "!bg-amber-700 !text-white hover:!bg-amber-800",
      },
      duration: 5000,
    });
  },
  info: (title: string, description?: string) => {
    return toast.info(title, {
      description,
      classNames: {
        toast: "!bg-blue-600 !border-blue-600 !text-white shadow-lg",
        title: "!text-white font-semibold",
        description: "!text-blue-100",
        actionButton: "!bg-white !text-blue-600 hover:!bg-blue-50 font-medium",
        cancelButton: "!bg-blue-700 !text-white hover:!bg-blue-800",
      },
      duration: 5000,
    });
  },
};

export { Toaster, toast };
