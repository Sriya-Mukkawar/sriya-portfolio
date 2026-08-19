import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createProgress } from "../hooks/progress";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const apiRef = useRef(null);

  useEffect(() => {
    const api = createProgress(setProgress);
    apiRef.current = api;
    return () => {
      api.stop();
      if (apiRef.current === api) apiRef.current = null;
    };
  }, []);

  const finishLoadingAssets = useCallback(() => {
    if (apiRef.current) return apiRef.current.loaded();
    setProgress(100);
    return Promise.resolve();
  }, []);

  const value = useMemo(
    () => ({
      progress,
      setProgress,
      isLoading,
      setIsLoading,
      finishLoadingAssets,
    }),
    [progress, isLoading, finishLoadingAssets]
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
