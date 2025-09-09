// import React from "react";
// import { useEditorStore, TOOLS } from "../store";
// import { BsArrowsMove, BsType, BsSquare, BsCircle } from "react-icons/bs";
// // Helper component to inject the toolbar's specific styles
// const ToolbarStyles = () => (
//   <style>{`
//     .toolbar {
//       /* Uses existing styles from your global CSS for layout */
//       /* display: flex; flex-direction: column; etc. */
//     }

//     .tool-button {
//       /* Resetting default button styles */
//       background-color: transparent;
//       border: none;

//       /* Sizing and Alignment */
//       width: 44px;
//       height: 44px;
//       margin: 0 auto; /* Center in the flex column */
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;

//       /* Icon Color & Transitions */
//       color: #a0a0a0; /* Default icon color (muted) */
//       cursor: pointer;
//       transition: all 0.2s ease-in-out;
//     }

//     .tool-button:hover {
//       background-color: #3f3f3f; /* Subtle background on hover */
//       color: #e0e0e0; /* Brighter icon on hover */
//     }

//     .tool-button.active {
//       background-color: #b53b74; /* Accent color for active tool */
//       color: #ffffff; /* White icon for active tool */
//     }
//   `}</style>
// );

// export const Toolbar = () => {
//   const activeTool = useEditorStore((state) => state.activeTool);
//   const setActiveTool = useEditorStore((state) => state.setActiveTool);

//   return (
//     <div className="toolbar">
//       <ToolbarStyles /> {/* Inject the styles */}
//       <button
//         className={`tool-button ${activeTool === TOOLS.MOVE ? "active" : ""}`}
//         onClick={() => setActiveTool(TOOLS.MOVE)}
//         title="Move / Transform Tool (M)"
//       >
//         <BsArrowsMove size={20} />
//       </button>
//       <button
//         className={`tool-button ${activeTool === TOOLS.TEXT ? "active" : ""}`}
//         onClick={() => setActiveTool(TOOLS.TEXT)}
//         title="Text Tool (T)"
//       >
//         <BsType size={22} />
//       </button>
//       <button
//         className={`tool-button ${
//           activeTool === TOOLS.RECTANGLE ? "active" : ""
//         }`}
//         onClick={() => setActiveTool(TOOLS.RECTANGLE)}
//         title="Rectangle Tool"
//       >
//         <BsSquare size={20} />
//       </button>
//       <button
//         className={`tool-button ${activeTool === TOOLS.CIRCLE ? "active" : ""}`}
//         onClick={() => setActiveTool(TOOLS.CIRCLE)}
//         title="Circle Tool"
//       >
//         <BsCircle size={20} />
//       </button>
//     </div>
//   );
// };

// import React, { useRef, useEffect, useState } from "react";
// import { useEditorStore, TOOLS } from "../store";

// // Helper functions (getWrappedLines, fillTextWithSpacing) go here...
// // [I've omitted them for brevity, but make sure they are at the top of your file]
// const getWrappedLines = (ctx, text, maxWidth) => {
//   /* ... */
// };
// const fillTextWithSpacing = (ctx, text, x, y, spacing) => {
//   /* ... */
// };

// export const Toolbar = ({ onEnterEditMode }) => {
//   const canvasRef = useRef(null);
//   const dragStateRef = useRef(null);
//   const layerBoundsCache = useRef(new Map());
//   const imageCache = useRef(new Map());
//   const [forceUpdate, setForceUpdate] = useState(0);

//   // Get ALL state and actions from the store reactively
//   const {
//     layers,
//     backgroundColor,
//     selectedLayerId,
//     activeTool,
//     setSelectedLayerId,
//     addTextLayer,
//     addRectangleLayer,
//     addCircleLayer,
//     updateSelectedLayer,
//   } = useEditorStore((state) => {
//     const activePage = state.pages[state.activePageIndex];
//     return {
//       layers: activePage?.layers || [],
//       backgroundColor: activePage?.backgroundColor || "#ffffff",
//       selectedLayerId: state.selectedLayerId,
//       activeTool: state.activeTool,
//       setSelectedLayerId: state.setSelectedLayerId,
//       addTextLayer: state.addTextLayer,
//       addRectangleLayer: state.addRectangleLayer,
//       addCircleLayer: state.addCircleLayer,
//       updateSelectedLayer: state.updateSelectedLayer,
//     };
//   });

//   // useEffect for resizing canvas (no changes)
//   useEffect(() => {
//     /* ... */
//   }, []);

//   // Main drawing useEffect
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const { width: displayWidth, height: displayHeight } =
//       canvas.getBoundingClientRect();
//     ctx.fillStyle = backgroundColor;
//     ctx.fillRect(0, 0, displayWidth, displayHeight);
//     const logicalWidth = 1500;
//     const scale = displayWidth / logicalWidth;
//     ctx.save();
//     ctx.scale(scale, scale);

//     layers.forEach((layer) => {
//       ctx.save();
//       ctx.translate(layer.x, layer.y);
//       ctx.rotate((Math.PI / 180) * layer.rotation);

//       if (layer.type === "text") {
//         /* ... Your full text drawing logic ... */
//       } else if (layer.type === "rectangle") {
//         /* ... Your full rectangle drawing logic ... */
//       } else if (layer.type === "circle") {
//         /* ... Your full circle drawing logic ... */
//       } else if (layer.type === "image") {
//         /* ... Your full image drawing logic ... */
//       }
//       ctx.restore();
//     });

//     const selectedLayer = layers.find((l) => l.id === selectedLayerId);

//     if (selectedLayer && activeTool === TOOLS.MOVE) {
//       const bounds = layerBoundsCache.current.get(selectedLayer.id);
//       if (bounds) {
//         // ... Your full drawing logic for the blue box and handles ...
//       }
//     }
//     ctx.restore();
//   }, [layers, backgroundColor, selectedLayerId, activeTool, forceUpdate]);

//   // useEffect for mouse events
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!dragStateRef.current) return;
//       // ... all mouse move logic ...
//     };
//     const handleMouseUp = () => {
//       dragStateRef.current = null;
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [updateSelectedLayer]);

//   const findClickTarget = (mouseX, mouseY, scale) => {
//     /* ... Your full findClickTarget logic ... */
//   };
//   const handleDoubleClick = (e) => {
//     /* ... Your full handleDoubleClick logic ... */
//   };

//   const handleMouseDown = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const logicalWidth = 1500;
//     const scale = rect.width / logicalWidth;
//     const mouseX = (e.clientX - rect.left) / scale;
//     const mouseY = (e.clientY - rect.top) / scale;

//     if (activeTool === TOOLS.MOVE) {
//       const { layer: clickedLayer, handle } = findClickTarget(
//         mouseX,
//         mouseY,
//         scale
//       );
//       if (clickedLayer) {
//         if (clickedLayer.id !== selectedLayerId) {
//           setSelectedLayerId(clickedLayer.id);
//         }
//         if (handle) {
//           const commonDragState = {
//             initialLayer: { ...clickedLayer },
//             startPoint: { x: e.clientX, y: e.clientY },
//           };
//           if (handle === "rotate") {
//             /* Set up rotate state */
//           } else if (handle === "translate") {
//             dragStateRef.current = { ...commonDragState, mode: "translating" };
//           } else {
//             dragStateRef.current = {
//               ...commonDragState,
//               mode: "resizing",
//               handle,
//             };
//           }
//         }
//       } else {
//         setSelectedLayerId(null);
//       }
//     } else if (activeTool === TOOLS.TEXT) {
//       onEnterEditMode(addTextLayer(mouseX, mouseY));
//     } else if (activeTool === TOOLS.RECTANGLE) {
//       addRectangleLayer(mouseX, mouseY);
//     } else if (activeTool === TOOLS.CIRCLE) {
//       addCircleLayer(mouseX, mouseY);
//     }
//   };

//   return (
//     <div className="workspace">
//       <canvas
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onDoubleClick={handleDoubleClick}
//       />
//     </div>
//   );
// };

import React from "react";
import { useEditorStore, TOOLS } from "../store";
import { BsArrowsMove, BsType, BsSquare, BsCircle } from "react-icons/bs";

// Helper component to inject the toolbar's specific styles
const ToolbarStyles = () => (
  <style>{`
    .toolbar {
      /* Uses existing styles from your global CSS for layout */
    }
    .tool-button {
      background-color: transparent;
      border: none;
      width: 44px;
      height: 44px;
      margin: 0 auto;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a0a0a0;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .tool-button:hover {
      background-color: #3f3f3f;
      color: #e0e0e0;
    }
    .tool-button.active {
      background-color: #b53b74;
      color: #ffffff;
    }
  `}</style>
);

export const Toolbar = () => {
  // ✅ FIX: Select each piece of state on its own line.
  // This is the correct way to get data and prevents the infinite loop.
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId
  );

  const handleToolChange = (tool) => {
    setSelectedLayerId(null); // Deselect layer when changing tools
    setActiveTool(tool);
  };

  return (
    <div className="toolbar">
      <ToolbarStyles /> {/* Inject the styles */}
      <button
        className={`tool-button ${activeTool === TOOLS.MOVE ? "active" : ""}`}
        onClick={() => handleToolChange(TOOLS.MOVE)}
        title="Move / Transform Tool (M)"
      >
        <BsArrowsMove size={20} />
      </button>
      <button
        className={`tool-button ${activeTool === TOOLS.TEXT ? "active" : ""}`}
        onClick={() => handleToolChange(TOOLS.TEXT)}
        title="Text Tool (T)"
      >
        <BsType size={22} />
      </button>
      <button
        className={`tool-button ${
          activeTool === TOOLS.RECTANGLE ? "active" : ""
        }`}
        onClick={() => handleToolChange(TOOLS.RECTANGLE)}
        title="Rectangle Tool"
      >
        <BsSquare size={20} />
      </button>
      <button
        className={`tool-button ${activeTool === TOOLS.CIRCLE ? "active" : ""}`}
        onClick={() => handleToolChange(TOOLS.CIRCLE)}
        title="Circle Tool"
      >
        <BsCircle size={20} />
      </button>
    </div>
  );
};
