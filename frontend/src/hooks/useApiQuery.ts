"use client";

import { useCallback, useEffect, useState } from "react";

interface UseApiQueryResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  initialData: T,
  deps: ReadonlyArray<unknown>,
): UseApiQueryResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setData(initialData);
      setError(err instanceof Error ? err : new Error("Request failed"));
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, initialData]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await queryFn();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setData(initialData);
          setError(err instanceof Error ? err : new Error("Request failed"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-controlled
  }, deps);

  return { data, isLoading, error, refetch };
}
