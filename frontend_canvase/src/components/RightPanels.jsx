import React, { useState } from "react";
import { useEditorStore } from "../store";

export const RightPanels = () => {
  const layers = useEditorStore((state) => state.layers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId
  );
  const deleteLayer = useEditorStore((state) => state.deleteLayer);
  const reorderLayers = useEditorStore((state) => state.reorderLayers);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragStart = (e, id) => e.dataTransfer.setData("layerId", id);
  const handleDrop = (e, targetId) => {
    const draggedId = e.dataTransfer.getData("layerId");
    reorderLayers(draggedId, targetId);
    setDragOverId(null);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteLayer(id);
  };

  return (
    <div className="right-panels">
      <div className="panel-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Layers</h4>
        </div>
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, layer.id)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setDragOverId(layer.id)}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => handleDrop(e, layer.id)}
              style={{
                padding: "8px",
                cursor: "grab",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border:
                  dragOverId === layer.id
                    ? "2px dashed #0099ff"
                    : "2px solid transparent",
                backgroundColor:
                  layer.id === selectedLayerId ? "#0078d4" : "transparent",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            >
              <span>{layer.content || "(Empty Text)"}</span>
              <button
                onClick={(e) => handleDelete(e, layer.id)}
                title="Delete Layer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ddd",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
