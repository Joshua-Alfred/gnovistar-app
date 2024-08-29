import * as pdfjsLib from "pdfjs-dist/webpack.mjs";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.mjs";

function getViewerConfiguration() {
  return {
    mainContainer: document.getElementById("viewerContainer"),
    viewerContainer: document.getElementById("viewer"),
  };
}

async function webViewerLoad(url) {
  const config = getViewerConfiguration();

  // Some PDFs need external cmaps.
  //
  const CMAP_URL = "pdfjs-dist/cmaps/";
  const CMAP_PACKED = true;

  const DEFAULT_URL = url
  // To test the AcroForm and/or scripting functionality, try e.g. this file:
  // "../../test/pdfs/160F-2019.pdf"

  const ENABLE_XFA = true;
  const SEARCH_FOR = ""; // try "Mozilla";

  const SANDBOX_BUNDLE_SRC = new URL(
    "pdfjs-dist/build/pdf.sandbox.mjs",
    window.location
  );

  const eventBus = new pdfjsViewer.EventBus();
   // (Optionally) enable hyperlinks within PDF files.
   const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
  });

  // (Optionally) enable find controller.
  const pdfFindController = new pdfjsViewer.PDFFindController({
    eventBus,
    linkService: pdfLinkService,
  });

  // (Optionally) enable scripting support.
  const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
    eventBus,
    sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
  });

  const pdfViewer = new pdfjsViewer.PDFViewer({
      container: config.mainContainer,
      viewer: config.viewerContainer,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
      scriptingManager: pdfScriptingManager,
  });
  pdfLinkService.setViewer(pdfViewer);
  pdfScriptingManager.setViewer(pdfViewer);

  eventBus.on("pagesinit", function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    pdfViewer.currentScaleValue = "page-width";

    // We can try searching for things.
    if (SEARCH_FOR) {
      eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
    }
  });

  // Loading document.
  const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    enableXfa: ENABLE_XFA,
  });

  const pdfDocument = await loadingTask.promise;
  // Document loaded, specifying document for the viewer and
  // the (optional) linkService.
  pdfViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);
}

export { webViewerLoad };