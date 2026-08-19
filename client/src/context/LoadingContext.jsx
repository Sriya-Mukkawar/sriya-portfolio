import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createProgress } from "../hooks/progress";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const apiRef = useRef(null);

  const bumpProgress = useCallback((value) => {
    setProgress((prev) => Math.max(prev, value));
  }, []);

  useEffect(() => {
    const api = createProgress(bumpProgress);
    apiRef.current = api;
    return () => api.stop();
  }, [bumpProgress]);

  const finishLoadingAssets = useCallback(() => {
    if (apiRef.current) {
      return apiRef.current.loaded().finally(() => bumpProgress(100));
    }
    bumpProgress(100);
    return Promise.resolve();
  }, [bumpProgress]);

  const value = useMemo(
    () => ({
      progress,
      setProgress: bumpProgress,
      isLoading,
      setIsLoading,
      finishLoadingAssets,
    }),
    [progress, isLoading, bumpProgress, finishLoadingAssets]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
};
