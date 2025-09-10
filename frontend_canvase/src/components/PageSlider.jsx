import React from "react";
import { useEditorStore } from "../store";

export const PageSlider = () => {
  const pages = useEditorStore((state) => state.pages);
  const activePageIndex = useEditorStore((state) => state.activePageIndex);
  const setActivePageIndex = useEditorStore(
    (state) => state.setActivePageIndex
  );
  const addPage = useEditorStore((state) => state.addPage);
  // ✅ 1. Import the new deletePage action
  const deletePage = useEditorStore((state) => state.deletePage);

  return (
    <div className="page-slider-container">
      <div className="page-slider">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`page-thumbnail ${
              index === activePageIndex ? "active" : ""
            }`}
            onClick={() => setActivePageIndex(index)}
          >
            {/* ✅ 2. Add the delete button */}
            {pages.length > 1 && ( // Only show if there's more than one page
              <button
                className="page-delete-button"
                title="Delete Page"
                onClick={(e) => {
                  // e.stopPropagation() is crucial to prevent the parent div's
                  // onClick from firing, which would change the active page.
                  e.stopPropagation();
                  deletePage(index);
                }}
              >
                &times; {/* This is an "x" character */}
              </button>
            )}

            <div className="thumbnail-preview">
              {page.thumbnailUrl ? (
                <img
                  src={page.thumbnailUrl}
                  alt={`Page ${index + 1} Preview`}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: page.backgroundColor,
                  }}
                ></div>
              )}
            </div>
            <span>{index + 1}</span>
          </div>
        ))}
        <button className="add-page-button" onClick={addPage} title="Add Page">
          +
        </button>
      </div>
    </div>
  );
};
