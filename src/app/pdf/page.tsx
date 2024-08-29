"use client";

import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

import dynamic from "next/dynamic";
const PDF = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

export default function Test() {
  return <PDF />;
}
