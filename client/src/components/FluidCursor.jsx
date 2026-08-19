import { useEffect } from "react";
import initFluidCursor from "../hooks/fluidCursor";
import { useLoading } from "../context/LoadingContext";

const FluidCursor = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (isLoading) return;
    try {
      initFluidCursor();
    } catch (err) {
      console.error("Fluid cursor failed to start", err);
    }
  }, [isLoading]);

  return (
    <div className="fluid-cursor" aria-hidden="true">
      <canvas id="fluid" />
    </div>
  );
};

export default FluidCursor;
