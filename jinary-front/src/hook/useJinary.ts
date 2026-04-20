import { useState, useCallback, useEffect } from 'react';
import { jinary, JinaryMeta } from '../core/jinary';

interface UseJinaryOptions {
  autoFetch?: boolean;
}

// decodeFunction은 외부에서 주입받도록 설계하여 확장성을 높임
export const useJinary = <T>(
  url: string,
  decodeFunction: (binary: Uint8Array) => T,
  options: UseJinaryOptions = {},
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 성능 측정을 위한 메타데이터 상태
  const [meta, setMeta] = useState<JinaryMeta>({
    protobufSize: 0,
    jsonSize: 0,
    rawHex: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await jinary.get(url, decodeFunction);                                                                                
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [url, decodeFunction]);

  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, [options.autoFetch, fetchData]);

  // 반환값: UI에 필요한 모든 상태와 fetch 함수
  return { data, loading, error, meta, fetchData };
};
