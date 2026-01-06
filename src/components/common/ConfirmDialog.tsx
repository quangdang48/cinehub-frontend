import { useState, useEffect, useCallback } from "react";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "./Button";

export type ConfirmDialogType = "warning" | "danger" | "info" | "success";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  isLoading?: boolean;
}

const typeConfig: Record<
  ConfirmDialogType,
  { icon: typeof AlertTriangle; iconColor: string; buttonClass: string }
> = {
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    buttonClass: "bg-yellow-600 hover:bg-yellow-700",
  },
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-500",
    buttonClass: "bg-red-600 hover:bg-red-700",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    buttonClass: "bg-green-600 hover:bg-green-700",
  },
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning",
  isLoading = false,
}: ConfirmDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [isLoading, onClose]);

  const handleConfirm = useCallback(async () => {
    await onConfirm();
  }, [onConfirm]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 w-full max-w-md mx-4 transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 rounded-full bg-zinc-800 ${config.iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-zinc-300 mb-6 leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${config.buttonClass}`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom hook for easier usage
interface UseConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
}

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: UseConfirmDialogOptions | null;
    onConfirm: (() => void | Promise<void>) | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    options: null,
    onConfirm: null,
    isLoading: false,
  });

  const confirm = useCallback(
    (
      options: UseConfirmDialogOptions,
      onConfirm: () => void | Promise<void>
    ) => {
      setDialogState({
        isOpen: true,
        options,
        onConfirm,
        isLoading: false,
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (dialogState.onConfirm) {
      setDialogState((prev) => ({ ...prev, isLoading: true }));
      try {
        await dialogState.onConfirm();
        handleClose();
      } finally {
        setDialogState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  }, [dialogState.onConfirm, handleClose]);

  const DialogComponent = dialogState.options ? (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialogState.options.title}
      message={dialogState.options.message}
      confirmText={dialogState.options.confirmText}
      cancelText={dialogState.options.cancelText}
      type={dialogState.options.type}
      isLoading={dialogState.isLoading}
    />
  ) : null;

  return { confirm, Dialog: DialogComponent };
};
