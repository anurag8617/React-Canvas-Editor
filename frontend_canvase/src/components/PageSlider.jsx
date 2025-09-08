import React from "react";
import { useEditorStore } from "../store";

export const PageSlider = () => {
  const pages = useEditorStore((state) => state.pages);
  const activePageIndex = useEditorStore((state) => state.activePageIndex);
  const setActivePageIndex = useEditorStore(
    (state) => state.setActivePageIndex
  );
  const addPage = useEditorStore((state) => state.addPage);

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
            <div
              className="thumbnail-preview"
              style={{ backgroundColor: page.backgroundColor }}
            ></div>
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
