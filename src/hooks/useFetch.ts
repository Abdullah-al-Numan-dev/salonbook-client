"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/api";

type Result<T> = { sig: string; data: T | null; error: string };

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // One string describes "which request is current". All deps are plain values.
  const sig = JSON.stringify([...deps, reloadKey]);

  useEffect(() => {
    let cancelled = false;
    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setResult({ sig, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({ sig, data: null, error: getErrorMessage(err, "Could not load data") });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sig]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  // Loading means the stored result belongs to an older request
  const current = result && result.sig === sig ? result : null;

  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? "",
    refetch,
  };
}