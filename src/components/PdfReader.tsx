import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use the worker from pdfjs-dist via CDN-free local import
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfReaderProps {
  file: string;
  title: string;
}

export function PdfReader({ file, title }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(900);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.min(entry.contentRect.width, 1100);
        setWidth(w);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0a0a10] flex flex-col items-center py-6 px-2 sm:px-4 overflow-y-auto"
      style={{ maxHeight: "min(85vh, 1100px)" }}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="label-eyebrow mb-3">Не удалось загрузить PDF</div>
            <p className="text-[14px] text-text-secondary mb-6 leading-[1.6]">
              {error}
            </p>
            <a
              href={file}
              download
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium"
              style={{ background: "var(--brand)", color: "#0a0a10" }}
            >
              Скачать PDF
            </a>
          </div>
        </div>
      ) : (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(e) => setError(e.message)}
          loading={
            <div className="text-text-tertiary text-[13px] py-12">
              Загрузка PDF…
            </div>
          }
          error={
            <div className="text-text-tertiary text-[13px] py-12">
              Не удалось загрузить PDF
            </div>
          }
          options={{
            cMapUrl: "https://unpkg.com/pdfjs-dist@4.8.69/cmaps/",
            cMapPacked: true,
            standardFontDataUrl:
              "https://unpkg.com/pdfjs-dist@4.8.69/standard_fonts/",
          }}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={`page_${i + 1}`}
              className="mb-4 shadow-2xl rounded-md overflow-hidden bg-white"
            >
              <Page
                pageNumber={i + 1}
                width={width}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={
                  <div
                    className="bg-white"
                    style={{ width, height: width * 1.414 }}
                  />
                }
              />
            </div>
          ))}
        </Document>
      )}
      {numPages > 0 && !error && (
        <div className="text-text-tertiary text-[12px] mt-2" aria-label={title}>
          {numPages} страниц
        </div>
      )}
    </div>
  );
}
