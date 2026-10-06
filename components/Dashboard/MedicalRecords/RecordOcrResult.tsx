"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { btnGhost } from "@/components/ui/Field";
import { getRecordOcr, type ApiOcrResult } from "@/lib/api";

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_DURATION_MS = 3 * 60 * 1_000;

const statusLabels: Record<ApiOcrResult["status"], string> = {
  queued: "Text extraction queued",
  processing: "Extracting text",
  succeeded: "Text extraction complete",
  failed: "Text extraction failed",
};

export default function RecordOcrResult({ recordId }: { recordId: string }) {
  const [result, setResult] = useState<ApiOcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = Date.now() + MAX_POLL_DURATION_MS;

    const poll = async () => {
      try {
        const next = await getRecordOcr(recordId);
        if (cancelled) return;
        setResult(next);
        setError(null);

        if (next.status === "succeeded" || next.status === "failed") return;
        if (Date.now() >= deadline) {
          setTimedOut(true);
          return;
        }
        timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      } catch (cause) {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : "Text extraction status could not be loaded.");
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [recordId, retryKey]);

  const retryCheck = () => {
    setResult(null);
    setError(null);
    setTimedOut(false);
    setRetryKey((key) => key + 1);
  };

  return (
    <section className="mt-3 rounded-lg border border-line bg-[#fafbff] p-3" aria-live="polite">
      {error ? (
        <div>
          <p className="text-xs text-danger">Text extraction status unavailable: {error}</p>
          <button type="button" onClick={retryCheck} className={`${btnGhost} mt-2`}>
            <RefreshCw size={14} /> Check again
          </button>
        </div>
      ) : !result ? (
        <p className="text-xs text-mute">Checking text extraction status…</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-ink">{statusLabels[result.status]}</p>
            {result.status === "failed" && (
              <p className="text-xs text-mute">
                {result.error ? `Code: ${result.error}. ` : ""}
                Re-upload the attachment from Medical Records to try OCR again.
              </p>
            )}
            {timedOut && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-mute">Still processing. Check again later.</p>
                <button type="button" onClick={retryCheck} className={`${btnGhost} py-1.5`}>
                  <RefreshCw size={13} /> Check
                </button>
              </div>
            )}
          </div>
          {result.status === "succeeded" && (
            <>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mute">
                {result.quality && <span>OCR quality: {result.quality}</span>}
                {result.needsReview && <span className="font-semibold text-[#9a6700]">Review suggested</span>}
                {result.flags && result.flags.length > 0 && <span>Flags: {result.flags.join(", ")}</span>}
                {typeof result.confidence === "number" && (
                  <span>Estimated text-recognition confidence: {Math.round(result.confidence)}%</span>
                )}
              </div>
              {typeof result.confidence === "number" && (
                <p className="mt-1 text-[11px] leading-4 text-mute">
                  This is an approximate OCR word score, not a measure of medical or document accuracy.
                </p>
              )}
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-semibold text-brand">View extracted text</summary>
                <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-md border border-line bg-white p-3 font-sans text-xs leading-5 text-body">
                  {result.text || "No text was returned."}
                </pre>
              </details>
            </>
          )}
        </>
      )}
    </section>
  );
}
