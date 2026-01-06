import { createContext, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-999999999 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              min-w-[260px] px-4 py-3 rounded-lg text-white shadow-lg 
              animate-[slideIn_0.3s_ease,fadeOut_0.3s_ease_2.7s_forwards]
              ${t.type === "success" ? "bg-green-500" : ""}
              ${t.type === "error" ? "bg-red-500" : ""}
              ${t.type === "info" ? "bg-blue-500" : ""}
            `}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Keyframes inline for Tailwind v4 */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(40px); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
