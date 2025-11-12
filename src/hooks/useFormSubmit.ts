import { useState, useCallback } from "react";

interface UseFormSubmitOptions<T> {
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

export function useFormSubmit<T>({
  onSubmit,
  onSuccess,
  onError,
}: UseFormSubmitOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = useCallback(
    async (values: T) => {
      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
        await onSubmit(values);
        onSuccess?.();
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "An unexpected error occurred";
        setError(errorMessage);
        onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit, onSuccess, onError]
  );

  const resetMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const setSuccessMessage = useCallback((message: string) => {
    setSuccess(message);
    setError("");
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
    setSuccess("");
  }, []);

  return {
    isLoading,
    error,
    success,
    handleSubmit,
    resetMessages,
    setSuccessMessage,
    setErrorMessage,
  };
}
