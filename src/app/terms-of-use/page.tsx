"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import useScreenSize from "@/src/hooks/useScreenSize";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const maxWidth = 1500;

export default function TermsOfUse() {
  const [numPages, setNumPages] = useState<number>();
  const { containerWidth, setContainerRef } = useScreenSize();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div
      className="flex justify-center items-center relative"
      ref={setContainerRef}>
      <Document
        file="https://gittjeqpqcmmbterylkd.supabase.co/storage/v1/object/public/agreements/ladderit-uyelik-sozlesmesivekullanim-kosullari.pdf?t=2024-05-10T11%3A08%3A20.741Z"
        onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <>
            <Page
              key={index}
              pageNumber={index + 1}
              width={
                containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
              }
              className="mb-2 md:mb-4"
            />
          </>
        ))}
      </Document>
    </div>
  );
}
