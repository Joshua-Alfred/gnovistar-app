"use client";

import { useState, useEffect, useRef } from "react";
import { webViewerLoad } from "./viewer";
import HighlightPop from "./components/HighlightModal";
import "pdfjs-dist/web/pdf_viewer.css";

export default function SimpleViewer() {
  const [pdf, setPdf] = useState("/multipage.pdf");
  const viewerContainerRef = useRef(null);

  useEffect(() => {
    webViewerLoad(pdf);
  }, [pdf]);

  return (
    <>
      <HighlightPop viewerRef={viewerContainerRef}>
        <div
          id="viewerContainer"
          ref={viewerContainerRef}
          className="overflow-auto absolute h-[80%] w-[80%]"
        >
          <div id="viewer" className="pdfViewer"></div>
        </div>
      </HighlightPop>
    </>
  );
}
