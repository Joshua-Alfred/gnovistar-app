"use client";

// ONLY IMPORT THIS USING DYNAMIC IMPORT

// import dynamic from "next/dynamic";
// const PDF = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

import { useState, useEffect } from "react";
import { loadPdf } from "./viewer";
import "./viewer.css";

//
// auto configured display layer
// without /webpack.mjs, we need to import 'pdfjs-dist'
// then add the core layer by doing 'pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.js"'
// where pdf.worker.js is asscessible from the bundle or the server
//
import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

//
// viewer layer
//
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.mjs";

const buttons = [
  { id: 'viewThumbnail', label: 'Thumbnails', ariaControls: 'thumbnailView', dataL10nId: 'pdfjs-thumbs-button' },
  { id: 'viewOutline', label: 'Document Outline', ariaControls: 'outlineView', dataL10nId: 'pdfjs-document-outline-button', title: 'Show Document Outline (double-click to expand/collapse all items)' },
  { id: 'viewAttachments', label: 'Attachments', ariaControls: 'attachmentsView', dataL10nId: 'pdfjs-attachments-button' },
  { id: 'viewLayers', label: 'Layers', ariaControls: 'layersView', dataL10nId: 'pdfjs-layers-button', title: 'Show Layers (double-click to reset all layers to the default state)' },
]

export default function Pdf() {
  const [activeSidebarView, setActiveSidebarView] = useState("viewThumbnail");


  useEffect(() => {

    console.log("loading pdf")
    loadPdf();

  }, []);


  return (
    <div className="h-full w-full">
      <div id="outerContainer">

      <div id="sidebarContainer">
        <div id="toolbarSidebar">
          <div id="toolbarSidebarLeft">
            <div id="sidebarViewButtons" className="splitToolbarButton toggled" role="radiogroup">
              {
                buttons.map((button, index) => (
                  <button
                    key={button.id}
                    id={button.id}
                    className="toolbarButton"
                    type="button"
                    title={button.title}
                    tabIndex={index + 2}
                    data-l10n-id={button.dataL10nId}
                    role="radio"
                    aria-checked={activeSidebarView === button.id}
                    aria-controls={button.ariaControls}
                    onClick={() => setActiveSidebarView(button.id)}
                    >
                      <span data-l10n-id={button.dataL10nId}>{button.label}</span>
                    </button>
                ))
              }
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div id="outlineOptionsContainer">
              <div className="verticalToolbarSeparator"></div>

              <button id="currentOutlineItem" className="toolbarButton" type="button" disabled={true} title="Find Current Outline Item" tabIndex={6} data-l10n-id="pdfjs-current-outline-item-button">
                <span data-l10n-id="pdfjs-current-outline-item-button-label">Current Outline Item</span>
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView">
          </div>
          <div id="outlineView" className="hidden">
          </div>
          <div id="attachmentsView" className="hidden">
          </div>
          <div id="layersView" className="hidden">
          </div>
        </div>
        <div id="sidebarResizer"></div>
      </div>  {/* sidebarContainer */}

      <div id="mainContainer">
        <div className="findbar hidden doorHanger" id="findbar">
          <div id="findbarInputContainer">
            <span className="loadingInput end">
              <input id="findInput" className="toolbarField" title="Find" placeholder="Find in document…" tabIndex={91} data-l10n-id="pdfjs-find-input" aria-invalid="false" />
            </span>
            <div className="splitToolbarButton">
              <button id="findPrevious" className="toolbarButton" type="button" title="Find the previous occurrence of the phrase" tabIndex={92} data-l10n-id="pdfjs-find-previous-button">
                <span data-l10n-id="pdfjs-find-previous-button-label">Previous</span>
              </button>
              <div className="splitToolbarButtonSeparator"></div>
              <button id="findNext" className="toolbarButton" type="button" title="Find the next occurrence of the phrase" tabIndex={93} data-l10n-id="pdfjs-find-next-button">
                <span data-l10n-id="pdfjs-find-next-button-label">Next</span>
              </button>
            </div>
          </div>

          <div id="findbarOptionsOneContainer">
            <input type="checkbox" id="findHighlightAll" className="toolbarField" tabIndex={94} />
            <label htmlFor="findHighlightAll" className="toolbarLabel" data-l10n-id="pdfjs-find-highlight-checkbox">Highlight All</label>
            <input type="checkbox" id="findMatchCase" className="toolbarField" tabIndex={95} />
            <label htmlFor="findMatchCase" className="toolbarLabel" data-l10n-id="pdfjs-find-match-case-checkbox-label">Match Case</label>
          </div>
          <div id="findbarOptionsTwoContainer">
            <input type="checkbox" id="findMatchDiacritics" className="toolbarField" tabIndex={96} />
            <label htmlFor="findMatchDiacritics" className="toolbarLabel" data-l10n-id="pdfjs-find-match-diacritics-checkbox-label">Match Diacritics</label>
            <input type="checkbox" id="findEntireWord" className="toolbarField" tabIndex={97} />
            <label htmlFor="findEntireWord" className="toolbarLabel" data-l10n-id="pdfjs-find-entire-word-checkbox-label">Whole Words</label>
          </div>

          <div id="findbarMessageContainer" aria-live="polite">
            <span id="findResultsCount" className="toolbarLabel"></span>
            <span id="findMsg" className="toolbarLabel"></span>
          </div>
        </div> {/* findbar */}

        <div className="editorParamsToolbar hidden doorHangerRight" id="editorHighlightParamsToolbar">
          <div id="highlightParamsToolbarContainer" className="editorParamsToolbarContainer">
            <div id="editorHighlightColorPicker" className="colorPicker">
              <span id="highlightColorPickerLabel" className="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-colorpicker-label">Highlight color</span>
            </div>
            <div id="editorHighlightThickness">
              <label htmlFor="editorFreeHighlightThickness" className="editorParamsLabel" data-l10n-id="pdfjs-editor-free-highlight-thickness-input">Thickness</label>
              <div className="thicknessPicker">
                <input type="range" id="editorFreeHighlightThickness" className="editorParamsSlider" data-l10n-id="pdfjs-editor-free-highlight-thickness-title" value="12" min="8" max="24" step="1" tabIndex={101} />
              </div>
            </div>
            <div id="editorHighlightVisibility">
              <div className="divider"></div>
              <div className="toggler">
                <label htmlFor="editorHighlightShowAll" className="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-show-all-button-label">Show all</label>
                <button id="editorHighlightShowAll" className="toggle-button" type="button" data-l10n-id="pdfjs-editor-highlight-show-all-button" aria-pressed="true" tabIndex={102}></button>
              </div>
            </div>
          </div>
        </div>

        <div className="editorParamsToolbar hidden doorHangerRight" id="editorFreeTextParamsToolbar">
          <div className="editorParamsToolbarContainer">
            <div className="editorParamsSetter">
              <label htmlFor="editorFreeTextColor" className="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-color-input">Color</label>
              <input type="color" id="editorFreeTextColor" className="editorParamsColor" tabIndex={103} />
            </div>
            <div className="editorParamsSetter">
              <label htmlFor="editorFreeTextFontSize" className="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-size-input">Size</label>
              <input type="range" id="editorFreeTextFontSize" className="editorParamsSlider" value="10" min="5" max="100" step="1" tabIndex={104} />
            </div>
          </div>
        </div>

        <div className="editorParamsToolbar hidden doorHangerRight" id="editorInkParamsToolbar">
          <div className="editorParamsToolbarContainer">
            <div className="editorParamsSetter">
              <label htmlFor="editorInkColor" className="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-color-input">Color</label>
              <input type="color" id="editorInkColor" className="editorParamsColor" tabIndex={105} />
            </div>
            <div className="editorParamsSetter">
              <label htmlFor="editorInkThickness" className="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-thickness-input">Thickness</label>
              <input type="range" id="editorInkThickness" className="editorParamsSlider" value="1" min="1" max="20" step="1" tabIndex={106} />
            </div>
            <div className="editorParamsSetter">
              <label htmlFor="editorInkOpacity" className="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-opacity-input">Opacity</label>
              <input type="range" id="editorInkOpacity" className="editorParamsSlider" value="100" min="1" max="100" step="1" tabIndex={107} />
            </div>
          </div>
        </div>

        <div className="editorParamsToolbar hidden doorHangerRight" id="editorStampParamsToolbar">
          <div className="editorParamsToolbarContainer">
            <button id="editorStampAddImage" className="toolbarButton labeled" type="button" title="Add image" tabIndex={107} data-l10n-id="pdfjs-editor-stamp-add-image-button">
              <span className="editorParamsLabel" data-l10n-id="pdfjs-editor-stamp-add-image-button-label">Add image</span>
            </button>
          </div>
        </div>

        <div id="secondaryToolbar" className="secondaryToolbar hidden doorHangerRight">
          <div id="secondaryToolbarButtonContainer">

                  <button id="secondaryOpenFile" className="toolbarButton labeled" type="button" title="Open File" tabIndex={51} data-l10n-id="pdfjs-open-file-button">
                    <span data-l10n-id="pdfjs-open-file-button-label">Open</span>
                  </button>

            <button id="secondaryPrint" className="toolbarButton labeled visibleMediumView" type="button" title="Print" tabIndex={52} data-l10n-id="pdfjs-print-button">
              <span data-l10n-id="pdfjs-print-button-label">Print</span>
            </button>

            <button id="secondaryDownload" className="toolbarButton labeled visibleMediumView" type="button" title="Save" tabIndex={53} data-l10n-id="pdfjs-save-button">
              <span data-l10n-id="pdfjs-save-button-label">Save</span>
            </button>
      <div className="horizontalToolbarSeparator visibleMediumView"></div>

            <button id="presentationMode" className="toolbarButton labeled" type="button" title="Switch to Presentation Mode" tabIndex={54} data-l10n-id="pdfjs-presentation-mode-button">
              <span data-l10n-id="pdfjs-presentation-mode-button-label">Presentation Mode</span>
            </button>

            <a href="#" id="viewBookmark" className="toolbarButton labeled" title="Current Page (View URL from Current Page)" tabIndex={55} data-l10n-id="pdfjs-bookmark-button">
              <span data-l10n-id="pdfjs-bookmark-button-label">Current Page</span>
            </a>

            <div id="viewBookmarkSeparator" className="horizontalToolbarSeparator"></div>

            <button id="firstPage" className="toolbarButton labeled" type="button" title="Go to First Page" tabIndex={56} data-l10n-id="pdfjs-first-page-button">
              <span data-l10n-id="pdfjs-first-page-button-label">Go to First Page</span>
            </button>
            <button id="lastPage" className="toolbarButton labeled" type="button" title="Go to Last Page" tabIndex={57} data-l10n-id="pdfjs-last-page-button">
              <span data-l10n-id="pdfjs-last-page-button-label">Go to Last Page</span>
            </button>

            <div className="horizontalToolbarSeparator"></div>

            <button id="pageRotateCw" className="toolbarButton labeled" type="button" title="Rotate Clockwise" tabIndex={58} data-l10n-id="pdfjs-page-rotate-cw-button">
              <span data-l10n-id="pdfjs-page-rotate-cw-button-label">Rotate Clockwise</span>
            </button>
            <button id="pageRotateCcw" className="toolbarButton labeled" type="button" title="Rotate Counterclockwise" tabIndex={59} data-l10n-id="pdfjs-page-rotate-ccw-button">
              <span data-l10n-id="pdfjs-page-rotate-ccw-button-label">Rotate Counterclockwise</span>
            </button>

            <div className="horizontalToolbarSeparator"></div>

            <div id="cursorToolButtons" role="radiogroup">
              <button id="cursorSelectTool" className="toolbarButton labeled toggled" type="button" title="Enable Text Selection Tool" tabIndex={60} data-l10n-id="pdfjs-cursor-text-select-tool-button" role="radio" aria-checked="true">
                <span data-l10n-id="pdfjs-cursor-text-select-tool-button-label">Text Selection Tool</span>
              </button>
              <button id="cursorHandTool" className="toolbarButton labeled" type="button" title="Enable Hand Tool" tabIndex={61} data-l10n-id="pdfjs-cursor-hand-tool-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-cursor-hand-tool-button-label">Hand Tool</span>
              </button>
            </div>

            <div className="horizontalToolbarSeparator"></div>

            <div id="scrollModeButtons" role="radiogroup">
              <button id="scrollPage" className="toolbarButton labeled" type="button" title="Use Page Scrolling" tabIndex={62} data-l10n-id="pdfjs-scroll-page-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-scroll-page-button-label">Page Scrolling</span>
              </button>
              <button id="scrollVertical" className="toolbarButton labeled toggled" type="button" title="Use Vertical Scrolling" tabIndex={63} data-l10n-id="pdfjs-scroll-vertical-button" role="radio" aria-checked="true">
                <span data-l10n-id="pdfjs-scroll-vertical-button-label" >Vertical Scrolling</span>
              </button>
              <button id="scrollHorizontal" className="toolbarButton labeled" type="button" title="Use Horizontal Scrolling" tabIndex={64} data-l10n-id="pdfjs-scroll-horizontal-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-scroll-horizontal-button-label">Horizontal Scrolling</span>
              </button>
              <button id="scrollWrapped" className="toolbarButton labeled" type="button" title="Use Wrapped Scrolling" tabIndex={65} data-l10n-id="pdfjs-scroll-wrapped-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-scroll-wrapped-button-label">Wrapped Scrolling</span>
              </button>
            </div>

            <div className="horizontalToolbarSeparator"></div>

            <div id="spreadModeButtons" role="radiogroup">
              <button id="spreadNone" className="toolbarButton labeled toggled" type="button" title="Do not join page spreads" tabIndex={66} data-l10n-id="pdfjs-spread-none-button" role="radio" aria-checked="true">
                <span data-l10n-id="pdfjs-spread-none-button-label">No Spreads</span>
              </button>
              <button id="spreadOdd" className="toolbarButton labeled" type="button" title="Join page spreads starting with odd-numbered pages" tabIndex={67} data-l10n-id="pdfjs-spread-odd-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-spread-odd-button-label">Odd Spreads</span>
              </button>
              <button id="spreadEven" className="toolbarButton labeled" type="button" title="Join page spreads starting with even-numbered pages" tabIndex={68} data-l10n-id="pdfjs-spread-even-button" role="radio" aria-checked="false">
                <span data-l10n-id="pdfjs-spread-even-button-label">Even Spreads</span>
              </button>
            </div>

            <div id="imageAltTextSettingsSeparator" className="horizontalToolbarSeparator hidden"></div>
            <button id="imageAltTextSettings" type="button" className="toolbarButton labeled hidden" title="Image alt text settings" tabIndex={69} data-l10n-id="pdfjs-image-alt-text-settings-button" aria-controls="altTextSettingsDialog">
              <span data-l10n-id="pdfjs-image-alt-text-settings-button-label">Image alt text settings</span>
            </button>

            <div className="horizontalToolbarSeparator"></div>

            <button id="documentProperties" className="toolbarButton labeled" type="button" title="Document Properties…" tabIndex={70} data-l10n-id="pdfjs-document-properties-button" aria-controls="documentPropertiesDialog">
              <span data-l10n-id="pdfjs-document-properties-button-label">Document Properties…</span>
            </button>
          </div>
        </div> {/* secondaryToolbar */}

        <div className="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer">
              <div id="toolbarViewerLeft">
                <button id="sidebarToggle" className="toolbarButton" type="button" title="Toggle Sidebar" tabIndex={11} data-l10n-id="pdfjs-toggle-sidebar-button" aria-expanded="false" aria-controls="sidebarContainer">
                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label">Toggle Sidebar</span>
                </button>
                <div className="toolbarButtonSpacer"></div>
                <button id="viewFind" className="toolbarButton" type="button" title="Find in Document" tabIndex={12} data-l10n-id="pdfjs-findbar-button" aria-expanded="false" aria-controls="findbar">
                  <span data-l10n-id="pdfjs-findbar-button-label">Find</span>
                </button>
                <div className="splitToolbarButton hiddenSmallView">
                  <button className="toolbarButton" title="Previous Page" id="previous" type="button" tabIndex={13} data-l10n-id="pdfjs-previous-button">
                    <span data-l10n-id="pdfjs-previous-button-label">Previous</span>
                  </button>
                  <div className="splitToolbarButtonSeparator"></div>
                  <button className="toolbarButton" title="Next Page" id="next" type="button" tabIndex={14} data-l10n-id="pdfjs-next-button">
                    <span data-l10n-id="pdfjs-next-button-label">Next</span>
                  </button>
                </div>
                <span className="loadingInput start">
                  <input type="number" id="pageNumber" className="toolbarField" title="Page" value="1" min="1" tabIndex={15} data-l10n-id="pdfjs-page-input" autoComplete="off" />
                </span>
                <span id="numPages" className="toolbarLabel"></span>
              </div>
              <div id="toolbarViewerRight">
                <div id="editorModeButtons" className="splitToolbarButton toggled" role="radiogroup">
                  <button id="editorHighlight" className="toolbarButton" type="button" disabled={true} title="Highlight" role="radio" aria-checked="false" aria-controls="editorHighlightParamsToolbar" tabIndex={31} data-l10n-id="pdfjs-editor-highlight-button">
                    <span data-l10n-id="pdfjs-editor-highlight-button-label">Highlight</span>
                  </button>
                  <button id="editorFreeText" className="toolbarButton" type="button" disabled={true} title="Text" role="radio" aria-checked="false" aria-controls="editorFreeTextParamsToolbar" tabIndex={32} data-l10n-id="pdfjs-editor-free-text-button">
                    <span data-l10n-id="pdfjs-editor-free-text-button-label">Text</span>
                  </button>
                  <button id="editorInk" className="toolbarButton" type="button" disabled={true} title="Draw" role="radio" aria-checked="false" aria-controls="editorInkParamsToolbar" tabIndex={33} data-l10n-id="pdfjs-editor-ink-button">
                    <span data-l10n-id="pdfjs-editor-ink-button-label">Draw</span>
                  </button>
                  <button id="editorStamp" className="toolbarButton" type="button" disabled={true} title="Add or edit images" role="radio" aria-checked="false" aria-controls="editorStampParamsToolbar" tabIndex={34} data-l10n-id="pdfjs-editor-stamp-button">
                    <span data-l10n-id="pdfjs-editor-stamp-button-label">Add or edit images</span>
                  </button>
                </div>

                <div id="editorModeSeparator" className="verticalToolbarSeparator"></div>

                <button id="print" className="toolbarButton hiddenMediumView" type="button" title="Print" tabIndex={41} data-l10n-id="pdfjs-print-button">
                  <span data-l10n-id="pdfjs-print-button-label">Print</span>
                </button>

                <button id="download" className="toolbarButton hiddenMediumView" type="button" title="Save" tabIndex={42} data-l10n-id="pdfjs-save-button">
                  <span data-l10n-id="pdfjs-save-button-label">Save</span>
                </button>

                <div className="verticalToolbarSeparator hiddenMediumView"></div>

                <button id="secondaryToolbarToggle" className="toolbarButton" type="button" title="Tools" tabIndex={43} data-l10n-id="pdfjs-tools-button" aria-expanded="false" aria-controls="secondaryToolbar">
                  <span data-l10n-id="pdfjs-tools-button-label">Tools</span>
                </button>
              </div>
              <div id="toolbarViewerMiddle">
                <div className="splitToolbarButton">
                  <button id="zoomOut" className="toolbarButton" type="button" title="Zoom Out" tabIndex={21} data-l10n-id="pdfjs-zoom-out-button">
                    <span data-l10n-id="pdfjs-zoom-out-button-label">Zoom Out</span>
                  </button>
                  <div className="splitToolbarButtonSeparator"></div>
                  <button id="zoomIn" className="toolbarButton" type="button" title="Zoom In" tabIndex={22} data-l10n-id="pdfjs-zoom-in-button">
                    <span data-l10n-id="pdfjs-zoom-in-button-label">Zoom In</span>
                  </button>
                </div>
                <span id="scaleSelectContainer" className="dropdownToolbarButton">
                  <select id="scaleSelect" title="Zoom" tabIndex={23} data-l10n-id="pdfjs-zoom-select">
                    <option id="pageAutoOption" title="" value="auto" selected={true} data-l10n-id="pdfjs-page-scale-auto">Automatic Zoom</option>
                    <option id="pageActualOption" title="" value="page-actual" data-l10n-id="pdfjs-page-scale-actual">Actual Size</option>
                    <option id="pageFitOption" title="" value="page-fit" data-l10n-id="pdfjs-page-scale-fit">Page Fit</option>
                    <option id="pageWidthOption" title="" value="page-width" data-l10n-id="pdfjs-page-scale-width">Page Width</option>
                    <option id="customScaleOption" title="" value="custom" disabled={true} hidden={true} data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 0 }'>0%</option>
                    <option title="" value="0.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 50 }'>50%</option>
                    <option title="" value="0.75" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 75 }'>75%</option>
                    <option title="" value="1" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 100 }'>100%</option>
                    <option title="" value="1.25" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 125 }'>125%</option>
                    <option title="" value="1.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 150 }'>150%</option>
                    <option title="" value="2" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 200 }'>200%</option>
                    <option title="" value="3" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 300 }'>300%</option>
                    <option title="" value="4" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 400 }'>400%</option>
                  </select>
                </span>
              </div>
            </div>
            <div id="loadingBar">
              <div className="progress">
                <div className="glimmer">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabIndex={0}>
          <div id="viewer" className="pdfViewer"></div>
        </div>
      </div> {/* mainContainer */}

      <div id="dialogContainer">
        <dialog id="passwordDialog">
          <div className="row">
            <label htmlFor="password" id="passwordText" data-l10n-id="pdfjs-password-label">Enter the password to open this PDF file:</label>
          </div>
          <div className="row">
            <input type="password" id="password" className="toolbarField" />
          </div>
          <div className="buttonRow">
            <button id="passwordCancel" className="dialogButton" type="button"><span data-l10n-id="pdfjs-password-cancel-button">Cancel</span></button>
            <button id="passwordSubmit" className="dialogButton" type="button"><span data-l10n-id="pdfjs-password-ok-button">OK</span></button>
          </div>
        </dialog>
        <dialog id="documentPropertiesDialog">
          <div className="row">
            <span id="fileNameLabel" data-l10n-id="pdfjs-document-properties-file-name">File name:</span>
            <p id="fileNameField" aria-labelledby="fileNameLabel">-</p>
          </div>
          <div className="row">
            <span id="fileSizeLabel" data-l10n-id="pdfjs-document-properties-file-size">File size:</span>
            <p id="fileSizeField" aria-labelledby="fileSizeLabel">-</p>
          </div>
          <div className="separator"></div>
          <div className="row">
            <span id="titleLabel" data-l10n-id="pdfjs-document-properties-title">Title:</span>
            <p id="titleField" aria-labelledby="titleLabel">-</p>
          </div>
          <div className="row">
            <span id="authorLabel" data-l10n-id="pdfjs-document-properties-author">Author:</span>
            <p id="authorField" aria-labelledby="authorLabel">-</p>
          </div>
          <div className="row">
            <span id="subjectLabel" data-l10n-id="pdfjs-document-properties-subject">Subject:</span>
            <p id="subjectField" aria-labelledby="subjectLabel">-</p>
          </div>
          <div className="row">
            <span id="keywordsLabel" data-l10n-id="pdfjs-document-properties-keywords">Keywords:</span>
            <p id="keywordsField" aria-labelledby="keywordsLabel">-</p>
          </div>
          <div className="row">
            <span id="creationDateLabel" data-l10n-id="pdfjs-document-properties-creation-date">Creation Date:</span>
            <p id="creationDateField" aria-labelledby="creationDateLabel">-</p>
          </div>
          <div className="row">
            <span id="modificationDateLabel" data-l10n-id="pdfjs-document-properties-modification-date">Modification Date:</span>
            <p id="modificationDateField" aria-labelledby="modificationDateLabel">-</p>
          </div>
          <div className="row">
            <span id="creatorLabel" data-l10n-id="pdfjs-document-properties-creator">Creator:</span>
            <p id="creatorField" aria-labelledby="creatorLabel">-</p>
          </div>
          <div className="separator"></div>
          <div className="row">
            <span id="producerLabel" data-l10n-id="pdfjs-document-properties-producer">PDF Producer:</span>
            <p id="producerField" aria-labelledby="producerLabel">-</p>
          </div>
          <div className="row">
            <span id="versionLabel" data-l10n-id="pdfjs-document-properties-version">PDF Version:</span>
            <p id="versionField" aria-labelledby="versionLabel">-</p>
          </div>
          <div className="row">
            <span id="pageCountLabel" data-l10n-id="pdfjs-document-properties-page-count">Page Count:</span>
            <p id="pageCountField" aria-labelledby="pageCountLabel">-</p>
          </div>
          <div className="row">
            <span id="pageSizeLabel" data-l10n-id="pdfjs-document-properties-page-size">Page Size:</span>
            <p id="pageSizeField" aria-labelledby="pageSizeLabel">-</p>
          </div>
          <div className="separator"></div>
          <div className="row">
            <span id="linearizedLabel" data-l10n-id="pdfjs-document-properties-linearized">Fast Web View:</span>
            <p id="linearizedField" aria-labelledby="linearizedLabel">-</p>
          </div>
          <div className="buttonRow">
            <button id="documentPropertiesClose" className="dialogButton" type="button"><span data-l10n-id="pdfjs-document-properties-close-button">Close</span></button>
          </div>
        </dialog>
        <dialog className="dialog altText" id="altTextDialog" aria-labelledby="dialogLabel" aria-describedby="dialogDescription">
          <div id="altTextContainer" className="mainContainer">
            <div id="overallDescription">
              <span id="dialogLabel" data-l10n-id="pdfjs-editor-alt-text-dialog-label" className="title">Choose an option</span>
              <span id="dialogDescription" data-l10n-id="pdfjs-editor-alt-text-dialog-description">
                Alt text (alternative text) helps when people can’t see the image or when it doesn’t load.
              </span>
            </div>
            <div id="addDescription">
              <div className="radio">
                <div className="radioButton">
                  <input type="radio" id="descriptionButton" name="altTextOption" tabIndex={0} aria-describedby="descriptionAreaLabel" checked/>
                  <label htmlFor="descriptionButton" data-l10n-id="pdfjs-editor-alt-text-add-description-label">Add a description</label>
                </div>
                <div className="radioLabel">
                  <span id="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-add-description-description">
                    Aim for 1-2 sentences that describe the subject, setting, or actions.
                  </span>
                </div>
              </div>
              <div className="descriptionArea">
                <textarea id="descriptionTextarea" placeholder="For example, “A young man sits down at a table to eat a meal”" aria-labelledby="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-textarea" tabIndex={0}></textarea>
              </div>
            </div>
            <div id="markAsDecorative">
              <div className="radio">
                <div className="radioButton">
                  <input type="radio" id="decorativeButton" name="altTextOption" aria-describedby="decorativeLabel" />
                  <label htmlFor="decorativeButton" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-label">Mark as decorative</label>
                </div>
                <div className="radioLabel">
                  <span id="decorativeLabel" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-description">
                    This is used for ornamental images, like borders or watermarks.
                  </span>
                </div>
              </div>
            </div>
            <div id="buttons">
              <button id="altTextCancel" className="secondaryButton" type="button" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-cancel-button">Cancel</span></button>
              <button id="altTextSave" className="primaryButton" type="button" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-save-button">Save</span></button>
            </div>
          </div>
        </dialog>
        <dialog className="dialog newAltText" id="newAltTextDialog" aria-labelledby="newAltTextTitle" aria-describedby="newAltTextDescription" tabIndex={0}>
          <div id="newAltTextContainer" className="mainContainer">
            <div className="title">
              <span id="newAltTextTitle" data-l10n-id="pdfjs-editor-new-alt-text-dialog-edit-label" role="sectionhead" tabIndex={0}>Edit alt text (image description)</span>
            </div>
            <div id="mainContent">
              <div id="descriptionAndSettings">
                <div id="descriptionInstruction">
                  <div id="newAltTextDescriptionContainer">
                    <div className="altTextSpinner" role="status" aria-live="polite"></div>
                    <textarea id="newAltTextDescriptionTextarea" placeholder="Write your description here…" aria-labelledby="descriptionAreaLabel" data-l10n-id="pdfjs-editor-new-alt-text-textarea" tabIndex={0}></textarea>
                  </div>
                  <span id="newAltTextDescription" role="note" data-l10n-id="pdfjs-editor-new-alt-text-description">Short description for people who can’t see the image or when the image doesn’t load.</span>
                  <div id="newAltTextDisclaimer" role="note"><div><span data-l10n-id="pdfjs-editor-new-alt-text-disclaimer1">This alt text was created automatically and may be inaccurate.</span> <a href="https://support.mozilla.org/en-US/kb/pdf-alt-text" target="_blank" rel="noopener noreferrer" id="newAltTextLearnMore" data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url" tabIndex={0}>Learn more</a></div></div>
                </div>
                <div id="newAltTextCreateAutomatically" className="toggler">
                  <button id="newAltTextCreateAutomaticallyButton" className="toggle-button" type="button" aria-pressed="true" tabIndex={0}></button>
                  <label htmlFor="newAltTextCreateAutomaticallyButton" className="togglerLabel" data-l10n-id="pdfjs-editor-new-alt-text-create-automatically-button-label">Create alt text automatically</label>
                </div>
                <div id="newAltTextDownloadModel" className="hidden">
                  <span id="newAltTextDownloadModelDescription" data-l10n-id="pdfjs-editor-new-alt-text-ai-model-downloading-progress" aria-valuemin={0} data-l10n-args='{ "totalSize": 0, "downloadedSize": 0 }'>Downloading alt text AI model (0 of 0 MB)</span>
                </div>
              </div>
              <div id="newAltTextImagePreview"></div>
            </div>
            <div id="newAltTextError" className="messageBar">
              <div>
                <div>
                  <span className="title" data-l10n-id="pdfjs-editor-new-alt-text-error-title">Couldn’t create alt text automatically</span>
                  <span  className="description" data-l10n-id="pdfjs-editor-new-alt-text-error-description">Please write your own alt text or try again later.</span>
                </div>
                <button id="newAltTextCloseButton" className="closeButton" type="button" tabIndex={0} title="Close"><span data-l10n-id="pdfjs-editor-new-alt-text-error-close-button">Close</span></button>
              </div>
            </div>
            <div id="newAltTextButtons" className="dialogButtonsGroup">
              <button id="newAltTextCancel" type="button" className="secondaryButton hidden" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-cancel-button">Cancel</span></button>
              <button id="newAltTextNotNow" type="button" className="secondaryButton" tabIndex={0}><span data-l10n-id="pdfjs-editor-new-alt-text-not-now-button">Not now</span></button>
              <button id="newAltTextSave" type="button" className="primaryButton" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-save-button">Save</span></button>
            </div>
          </div>
        </dialog>

        <dialog className="dialog" id="altTextSettingsDialog" aria-labelledby="altTextSettingsTitle">
          <div id="altTextSettingsContainer" className="mainContainer">
            <div className="title">
              <span id="altTextSettingsTitle" data-l10n-id="pdfjs-editor-alt-text-settings-dialog-label" role="sectionhead" tabIndex={0} className="title">Image alt text settings</span>
            </div>
            <div id="automaticAltText">
              <span data-l10n-id="pdfjs-editor-alt-text-settings-automatic-title">Automatic alt text</span>
              <div id="automaticSettings">
                <div id="createModelSetting">
                  <div className="toggler">
                    <button id="createModelButton" type="button" className="toggle-button" aria-pressed="true" tabIndex={0}></button>
                    <label htmlFor="createModelButton" className="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-create-model-button-label">Create alt text automatically</label>
                  </div>
                  <div id="createModelDescription" className="description">
                    <span data-l10n-id="pdfjs-editor-alt-text-settings-create-model-description">Suggests descriptions to help people who can’t see the image or when the image doesn’t load.</span> <a href="https://support.mozilla.org/en-US/kb/pdf-alt-text" target="_blank" rel="noopener noreferrer" id="altTextSettingsLearnMore" data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url" tabIndex={0}>Learn more</a>
                  </div>
                </div>
                <div id="aiModelSettings">
                  <div>
                    <span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-label" data-l10n-args='{ "totalSize": 180 }'>Alt text AI model (180MB)</span>
                    <div id="aiModelDescription" className="description">
                      <span data-l10n-id="pdfjs-editor-alt-text-settings-ai-model-description">Runs locally on your device so your data stays private. Required for automatic alt text.</span>
                    </div>
                  </div>
                  <button id="deleteModelButton" type="button" className="secondaryButton" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-settings-delete-model-button">Delete</span></button>
                  <button id="downloadModelButton" type="button" className="secondaryButton" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-button">Download</span></button>
                </div>
              </div>
            </div>
            <div className="dialogSeparator"></div>
            <div id="altTextEditor">
              <span data-l10n-id="pdfjs-editor-alt-text-settings-editor-title">Alt text editor</span>
              <div id="showAltTextEditor">
                <div className="toggler">
                  <button id="showAltTextDialogButton" type="button" className="toggle-button" aria-pressed="true" tabIndex={0}></button>
                  <label htmlFor="showAltTextDialogButton" className="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-button-label">Show alt text editor right away when adding an image</label>
                </div>
                <div id="showAltTextDialogDescription" className="description">
                  <span data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-description">Helps you make sure all your images have alt text.</span>
                </div>
              </div>
            </div>
            <div id="buttons" className="dialogButtonsGroup">
              <button id="altTextSettingsCloseButton" type="button" className="primaryButton" tabIndex={0}><span data-l10n-id="pdfjs-editor-alt-text-settings-close-button">Close</span></button>
            </div>
          </div>
        </dialog>
        <dialog id="printServiceDialog" className="min-w-[200px]">
          <div className="row">
            <span data-l10n-id="pdfjs-print-progress-message">Preparing document for printing…</span>
          </div>
          <div className="row">
            <progress value="0" max="100"></progress>
            <span data-l10n-id="pdfjs-print-progress-percent" data-l10n-args='{ "progress": 0 }' className="relative-progress">0%</span>
          </div>
          <div className="buttonRow">
            <button id="printCancel" className="dialogButton" type="button"><span data-l10n-id="pdfjs-print-progress-close-button">Cancel</span></button>
          </div>
        </dialog>
      </div> {/* dialogContainer */}

      </div> {/* outerContainer */}
      <div id="printContainer"></div>
    </div>
  );
}
