// import React, { useState, useRef } from "react";
// import { useEditorStore } from "./store";

// // Import all the new components
// import { Toolbar } from "./components/Toolbar";
// import { OptionsBar } from "./components/OptionsBar";
// import { RightPanels } from "./components/RightPanels";
// import { Workspace } from "./components/Workspace";
// import { TextEditModal } from "./components/TextEditModal";

// function App() {
//   const [editingLayer, setEditingLayer] = useState(null);
//   const layerBoundsCache = useRef(new Map());
//   const updateSelectedLayer = useEditorStore(
//     (state) => state.updateSelectedLayer
//   );
//   const deleteLayer = useEditorStore((state) => state.deleteLayer);

//   const handleEnterEditMode = (layer) => {
//     const bounds = layerBoundsCache.current.get(layer.id);
//     setEditingLayer({ ...layer, ...bounds });
//   };

//   const handleCommitTextChange = (newText) => {
//     if (newText.trim() === "" && editingLayer?.content === "") {
//       deleteLayer(editingLayer.id);
//     } else {
//       updateSelectedLayer("content", newText);
//     }
//   };

//   return (
//     <div className="app-container">
//       <Toolbar />
//       <OptionsBar />
//       <Workspace
//         onEnterEditMode={handleEnterEditMode}
//         layerBoundsCache={layerBoundsCache}
//       />
//       <RightPanels />
//       {editingLayer && (
//         <TextEditModal
//           editingLayer={editingLayer}
//           onCommit={handleCommitTextChange}
//           onExit={() => setEditingLayer(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from "react";
import { useEditorStore, TOOLS } from "./store";
import { Toolbar } from "./components/Toolbar";
import { OptionsBar } from "./components/OptionsBar";
import { RightPanels } from "./components/RightPanels";
import { Workspace } from "./components/Workspace";

const TextEditModal = ({ editingLayer, onCommit, onExit }) => {
  const [text, setText] = useState(editingLayer.content);
  const textareaRef = useRef(null);
  const updateSelectedLayer = useEditorStore(
    (state) => state.updateSelectedLayer
  );
  const selectedLayer = useEditorStore((state) =>
    state.layers.find((l) => l.id === state.selectedLayerId)
  );

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleCommit = () => {
    onCommit(text);
    onExit();
  };
  const toggleBold = () =>
    updateSelectedLayer(
      "fontWeight",
      selectedLayer.fontWeight === "bold" ? "normal" : "bold"
    );
  const toggleUnderline = () =>
    updateSelectedLayer("underline", !selectedLayer.underline);

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={toggleBold}
            style={{
              fontWeight:
                selectedLayer?.fontWeight === "bold" ? "bold" : "normal",
            }}
          >
            B
          </button>
          <button
            onClick={toggleUnderline}
            style={{
              textDecoration: selectedLayer?.underline ? "underline" : "none",
            }}
          >
            U
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onExit}>Cancel</button>
          <button className="ok-button" onClick={handleCommit}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [editingLayer, setEditingLayer] = useState(null);
  const layerBoundsCache = useRef(new Map());
  const { updateSelectedLayer, deleteLayer } = useEditorStore.getState();

  const handleEnterEditMode = (layer) => {
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
    <div className="app-container">
      <Toolbar />
      <OptionsBar />
      <Workspace
        onEnterEditMode={handleEnterEditMode}
        layerBoundsCache={layerBoundsCache}
      />
      <RightPanels />
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
