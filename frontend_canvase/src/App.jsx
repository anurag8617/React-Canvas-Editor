import React, { useState } from "react";
import { useEditorStore } from "./store";

// Import all the components
import { Toolbar } from "./components/Toolbar";
import { OptionsBar } from "./components/OptionsBar";
import { RightPanels } from "./components/RightPanels"; // This will be your Layers panel
import { Workspace } from "./components/Workspace";
import { TextEditModal } from "./components/TextEditModal";
import { PageSlider } from "./components/PageSlider";

function App() {
  const [editingLayer, setEditingLayer] = useState(null);

  // We only need a few actions here, the rest is handled by the components
  const updateSelectedLayer = useEditorStore(
    (state) => state.updateSelectedLayer
  );
  const deleteLayer = useEditorStore((state) => state.deleteLayer);

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const handleEnterEditMode = (layer) => {
    // Note: layerBoundsCache is now managed inside the Workspace component
    setEditingLayer(layer);
  };

  const handleCommitTextChange = (newText) => {
    if (newText.trim() === "" && editingLayer?.content === "") {
      deleteLayer(editingLayer.id);
    } else {
      updateSelectedLayer("content", newText);
    }
  };

  return (
    <div
      className={`app-container ${
        !isLeftPanelOpen ? "left-panel-closed" : ""
      } ${!isRightPanelOpen ? "right-panel-closed" : ""}`}
    >
      <button
        className="panel-toggle left"
        onClick={() => setIsLeftPanelOpen((prev) => !prev)}
        title={isLeftPanelOpen ? "Close Layers Panel" : "Open Layers Panel"}
      >
        {isLeftPanelOpen ? "❮" : "❯"}
      </button>
      <button
        className="panel-toggle right"
        onClick={() => setIsRightPanelOpen((prev) => !prev)}
        title={isRightPanelOpen ? "Close Options Panel" : "Open Options Panel"}
      >
        {isRightPanelOpen ? "❯" : "❮"}
      </button>

      <div className="left-sidebar">
        {/* Your Layers panel goes here. I'm assuming RightPanels is your layers panel */}
        <RightPanels />
      </div>

      <Toolbar />

      <div className="main-content">
        {/* No more props like layers or backgroundColor. 
          The Workspace now gets everything it needs from the store.
        */}
        <Workspace onEnterEditMode={handleEnterEditMode} />
        <PageSlider />
      </div>

      <div className="right-sidebar">
        <OptionsBar />
      </div>

      {editingLayer && (
        <TextEditModal
          editingLayer={editingLayer}
          onCommit={handleCommitTextChange}
          onExit={() => setEditingLayer(null)}
        />
      )}
    </div>
  );
}

export default App;
