import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useApiErrorHandler(statusCode?: number) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!statusCode) return;

    const errorRoutes: Record<number, string> = {
      401: "/401",
      403: "/403",
      500: "/500",
      503: "/503",
    };

    if (errorRoutes[statusCode]) {
      navigate(errorRoutes[statusCode]);
    }
  }, [statusCode, navigate]);
}

export default useApiErrorHandler;
