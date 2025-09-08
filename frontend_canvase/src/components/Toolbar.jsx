import React from "react";
import { useEditorStore, TOOLS } from "../store";
import { BsArrowsMove, BsType } from "react-icons/bs"; // Import icons

// Helper component to inject the toolbar's specific styles
const ToolbarStyles = () => (
  <style>{`
    .toolbar {
      /* Uses existing styles from your global CSS for layout */
      /* display: flex; flex-direction: column; etc. */
    }

    .tool-button {
      /* Resetting default button styles */
      background-color: transparent;
      border: none;
      
      /* Sizing and Alignment */
      width: 44px;
      height: 44px;
      margin: 0 auto; /* Center in the flex column */
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      /* Icon Color & Transitions */
      color: #a0a0a0; /* Default icon color (muted) */
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .tool-button:hover {
      background-color: #3f3f3f; /* Subtle background on hover */
      color: #e0e0e0; /* Brighter icon on hover */
    }

    .tool-button.active {
      background-color: #b53b74; /* Accent color for active tool */
      color: #ffffff; /* White icon for active tool */
    }
  `}</style>
);

export const Toolbar = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  return (
    <div className="toolbar">
      <ToolbarStyles /> {/* Inject the styles */}
      <button
        className={`tool-button ${activeTool === TOOLS.MOVE ? "active" : ""}`}
        onClick={() => setActiveTool(TOOLS.MOVE)}
        title="Move / Transform Tool (M)"
      >
        <BsArrowsMove size={20} />
      </button>
      <button
        className={`tool-button ${activeTool === TOOLS.TEXT ? "active" : ""}`}
        onClick={() => setActiveTool(TOOLS.TEXT)}
        title="Text Tool (T)"
      >
        <BsType size={22} />
      </button>
    </div>
  );
};
