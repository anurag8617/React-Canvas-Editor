import React from "react";
import { useEditorStore, TOOLS } from "../store";

export const Toolbar = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  return (
    <div className="toolbar">
      <button
        className={`tool-button ${activeTool === TOOLS.MOVE ? "active" : ""}`}
        onClick={() => setActiveTool(TOOLS.MOVE)}
        title="Transform Tool"
      >
        M
      </button>
      <button
        className={`tool-button ${activeTool === TOOLS.TEXT ? "active" : ""}`}
        onClick={() => setActiveTool(TOOLS.TEXT)}
        title="Text Tool"
      >
        T
      </button>
    </div>
  );
};
