import React from "react";
import { useEditorStore, TOOLS } from "../store";
import { BsArrowsMove, BsType, BsSquare, BsCircle } from "react-icons/bs";
import { TbLetterCaseUpper } from "react-icons/tb";

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
          activeTool === TOOLS.CURVE_TEXT ? "active" : ""
        }`}
        onClick={() => handleToolChange(TOOLS.CURVE_TEXT)}
        title="Curve Text Tool"
      >
        <TbLetterCaseUpper size={22} />
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
