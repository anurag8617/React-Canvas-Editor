import React, { useState } from "react";
import { useEditorStore } from "../store";
import { BsType, BsTrash, BsGripVertical } from "react-icons/bs"; // Import necessary icons

// Helper component to inject the panel's specific styles
const LayersPanelStyles = () => (
  <style>{`
    .layers-list {
      display: flex;
      flex-direction: column; /* Normal column direction */
      gap: 5px; /* Space between layer items */
    }
    .panel-section {
      padding: 12px 16px;
      border-bottom: 1px solid #89379f;
      color: #b53b74;
    } 

    .section-header {
      font-size: 12px;
      color: #b53b74;
    }
    .layer-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 6px;
      background-color: #383838;
      color: #e0e0e0;
      border: 1px solid transparent; /* Reserve space for border */
      transition: background-color 0.2s, border-color 0.2s;
      user-select: none;
    }

    .layer-item:hover {
      background-color: #3f3f3f;
    }

    .layer-item.selected {
      background-color: #b53b74; /* A subtle pink for selection */
    }

    .layer-item.drag-over {
      border-color: #89379f;
      border-style: dashed;
    }

    .layer-icon {
      flex-shrink: 0;
    }

    .layer-name {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .layer-drag-handle {
      cursor: grab;
      color: #888;
      flex-shrink: 0;
    }
    .layer-drag-handle:active {
        cursor: grabbing;
    }

    .layer-delete-button {
      background: none;
      border: none;
      color: #888; /* Muted color by default */
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      opacity: 0.5; /* Hide slightly by default */
      transition: opacity 0.2s, color 0.2s, background-color 0.2s;
      flex-shrink: 0;
    }

    .layer-item:hover .layer-delete-button {
      opacity: 1; /* Show fully on hover */
      color: #e0e0e0;
    }

    .layer-delete-button:hover {
      background-color: #ff3b30; /* Red background on hover */
      color: #fff !important;
    }
  `}</style>
);

export const RightPanels = ({ layers }) => {
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId
  );
  const deleteLayer = useEditorStore((state) => state.deleteLayer);
  const reorderLayers = useEditorStore((state) => state.reorderLayers);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("layerId", id);
    // Optional: for a nicer drag visual
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

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
      <LayersPanelStyles />
      <div>
        <h2 className="panel-section" style={{ marginTop: 0 }}>Layers</h2>
        {/*
          We now reverse the array in JS to have a more logical mapping.
          Top of the list is the top layer on canvas.
        */}
        <div className="layers-list">
          {[...layers].reverse().map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const isDragOver = layer.id === dragOverId;
            const itemClasses = `layer-item ${isSelected ? "selected" : ""} ${
              isDragOver ? "drag-over" : ""
            }`;

            return (
              <div
                key={layer.id}
                className={itemClasses}
                onClick={() => setSelectedLayerId(layer.id)}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, layer.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragOverId(layer.id)}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, layer.id)}
              >
                <div className="layer-drag-handle" title="Drag to reorder">
                  <BsGripVertical />
                </div>
                <div className="layer-icon" title={layer.type}>
                  {layer.type === "text" && <BsType />}
                  {/* Add other layer type icons here in the future */}
                </div>
                <span className="layer-name">
                  {layer.content || `(${layer.type} layer)`}
                </span>
                <button
                  className="layer-delete-button"
                  onClick={(e) => handleDelete(e, layer.id)}
                  title="Delete Layer"
                >
                  <BsTrash />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
