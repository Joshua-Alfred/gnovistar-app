import React, { useRef, useState, useEffect } from "react";
import "./styles.css";

const HighlightPop = ({
  children,
  viewerRef,
  popoverItems,
  onHighlightPop = () => {},
}: {
  children: React.ReactNode;
  viewerRef: React.MutableRefObject<HTMLDivElement | null>;
  popoverItems?: (itemClass: string) => React.ReactNode;
  onHighlightPop?: (selectedText: string) => void;
}) => {
  const [popoverState, setPopoverState] = useState({
    showPopover: false,
    x: 0,
    y: 0,
    selectedText: "",
  });

  const highlight = useRef<HTMLDivElement>(null);
  const highlightMenuRef = useRef<HTMLDivElement>(null);

  const hidePopover = () => {
    setPopoverState((prev) => ({ ...prev, showPopover: false }));
  };

  const onMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    console.log("selection: \n", selection);
    console.log("selected text: \n", selectedText);

    if (!selectedText) {
      hidePopover();
      return;
    }

    const selectionRange = selection.getRangeAt(0);
    console.log("selection range: \n", selectionRange);
    const startNode = selectionRange.startContainer.parentNode;
    const endNode = selectionRange.endContainer.parentNode;
    const highlightable = highlight.current as HTMLDivElement;

    console.log("start node: \n", startNode, "\nend node: \n", endNode);

    if (
      !highlightable.contains(startNode) ||
      !highlightable.contains(endNode)
    ) {
      console.log("region does not contain start or end node");
      hidePopover();
      return;
    }

    const { x, y, width } = selectionRange.getBoundingClientRect();
    console.log("x: \n", x, "\ny: \n", y, "\nwidth: \n", width);
    if (!width) {
      hidePopover();
      return;
    }

    setPopoverState({
      x: x + width / 2,
      y: y + window.scrollY - 10,
      selectedText,
      showPopover: true,
    });

    // Use the callback function
    // Should use more metadata to find the exact position of the highlight
    // will probably use page number and instance of selectedText found in the page
    onHighlightPop(selectedText);
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (popoverState.showPopover) {
        // Move menu with scroll
        // const selection = window.getSelection();
        // const selectionRange = selection.getRangeAt(0);
        // const { x, y, width } = selectionRange.getBoundingClientRect();
        // setTimeout(() => {
        //   setPopoverState((prev) => ({
        //     ...prev,
        //     x: x + width / 2,
        //     y: y + window.scrollY - 10,
        //   }));
        // }, 100); // ms
        hidePopover();
      }
    };

    if (viewerRef.current) {
      viewerRef.current.addEventListener("scroll", onScroll);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener("scroll", onScroll);
      }
    };
  }, [popoverState, viewerRef]);

  const { showPopover, x, y } = popoverState;
  const itemClass = "h-popover-item";

  return (
    <div ref={highlight} className="h-full w-full overflow-hidden">
      {showPopover && (
        <div
          ref={highlightMenuRef}
          className="h-popover"
          style={{ left: `${x}px`, top: `${y}px` }}
          role="presentation"
          onMouseDown={(e) => e.preventDefault()}
        >
          {popoverItems ? (
            popoverItems(itemClass)
          ) : (
            <span role="button" className={itemClass}>
              Add yours
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

HighlightPop.defaultProps = {
  onHighlightComment: null,
  onExitHighlight: null,
  popoverItems: null,
  children: null,
};

export default HighlightPop;
