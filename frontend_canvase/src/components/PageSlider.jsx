// import React from "react";
// import { useEditorStore } from "../store";

// export const PageSlider = () => {
//   const pages = useEditorStore((state) => state.pages);
//   const activePageIndex = useEditorStore((state) => state.activePageIndex);
//   const setActivePageIndex = useEditorStore(
//     (state) => state.setActivePageIndex
//   );
//   const addPage = useEditorStore((state) => state.addPage);

//   return (
//     <div className="page-slider-container">
//       <div className="page-slider">
//         {pages.map((page, index) => (
//           <div
//             key={page.id}
//             className={`page-thumbnail ${
//               index === activePageIndex ? "active" : ""
//             }`}
//             onClick={() => setActivePageIndex(index)}
//           >
//             <div
//               className="thumbnail-preview"
//               style={{ backgroundColor: page.backgroundColor }}
//             ></div>
//             <span>{index + 1}</span>
//           </div>
//         ))}
//         <button className="add-page-button" onClick={addPage} title="Add Page">
//           +
//         </button>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import { useEditorStore } from "../store";
// import { PageThumbnail } from "./PageThumbnail"; // <-- Import the new component

// export const PageSlider = () => {
//   const pages = useEditorStore((state) => state.pages);
//   const activePageIndex = useEditorStore((state) => state.activePageIndex);
//   const setActivePageIndex = useEditorStore(
//     (state) => state.setActivePageIndex
//   );
//   const addPage = useEditorStore((state) => state.addPage);

//   return (
//     <div className="page-slider-container">
//       <div className="page-slider">
//         {pages.map((page, index) => (
//           <PageThumbnail
//             key={page.id}
//             page={page}
//             pageNumber={index + 1}
//             isActive={index === activePageIndex}
//             onClick={() => setActivePageIndex(index)}
//           />
//         ))}
//         <button className="add-page-button" onClick={addPage} title="Add Page">
//           +
//         </button>
//       </div>
//     </div>
//   );
// };

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
