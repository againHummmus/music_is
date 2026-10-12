import { useEffect, useRef, useState } from 'react';

export function useFileWithPreview() {
  const [file, setFileState] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  const setFile = (next: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setFileState(next);
    setPreview(previewRef.current);
  };

  useEffect(() => {
    const previewUrl = previewRef;
    return () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    };
  }, []);

  return { file, setFile, preview };
}
