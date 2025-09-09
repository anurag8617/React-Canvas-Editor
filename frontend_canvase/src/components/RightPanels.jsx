import React, { useState } from "react";
import { useEditorStore } from "../store";
import {
  BsType,
  BsTrash,
  BsGripVertical,
  BsSquare,
  BsCircle,
  BsLayers,
  BsImage,
} from "react-icons/bs";

// A predefined list of assets for the example
const sampleAssets = [
  {
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=400",
    name: "Red Shoe",
  },
  {
    url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    name: "Vintage Camera",
  },
  {
    url: "https://images.unsplash.com/photo-1578642353139-2a92a2a0f3b3?w=400",
    name: "Headphones",
  },
];

const PanelStyles = () => (
  <style>{`
    .sidebar-tabs { display: flex; background-color: #383838; border-radius: 8px; padding: 4px; margin-bottom: 10px; }
    .sidebar-tab { flex: 1; padding: 8px; background: none; border: none; color: #9e9e9e; cursor: pointer; border-radius: 6px; font-weight: bold; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 5px; }
    .sidebar-tab:hover { background-color: #4f4f4f; color: #e0e0e0; }
    .sidebar-tab.active { background-color: #b53b74; color: white; }
    .assets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .asset-item img { width: 100%; height: 100px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
    .asset-item img:hover { border-color: #b53b74; }
    .layers-list { display: flex; flex-direction: column; gap: 5px; }
    .layer-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; background-color: #383838; color: #e0e0e0; border: 1px solid transparent; transition: background-color 0.2s, border-color 0.2s; user-select: none; }
    .layer-item:hover { background-color: #3f3f3f; }
    .layer-item.selected { background-color: #453b74; border-color: #b53b74; }
    .layer-item.drag-over { border-color: #89379f; border-style: dashed; }
    .layer-icon { flex-shrink: 0; }
    .layer-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer-drag-handle { cursor: grab; color: #888; flex-shrink: 0; }
    .layer-drag-handle:active { cursor: grabbing; }
    .layer-delete-button { background: none; border: none; color: #888; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; opacity: 0.5; transition: opacity 0.2s, color 0.2s, background-color 0.2s; flex-shrink: 0; }
    .layer-item:hover .layer-delete-button { opacity: 1; color: #e0e0e0; }
    .layer-delete-button:hover { background-color: #ff3b30; color: #fff !important; }
  `}</style>
);

export const RightPanels = () => {
  const [activePanel, setActivePanel] = useState("layers");
  const [dragOverId, setDragOverId] = useState(null);

  const layers = useEditorStore(
    (state) => state.pages[state.activePageIndex]?.layers || []
  );
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const addImageLayer = useEditorStore((state) => state.addImageLayer);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId
  );
  const deleteLayer = useEditorStore((state) => state.deleteLayer);
  const reorderLayers = useEditorStore((state) => state.reorderLayers);

  const handleAssetClick = (url) => {
    const img = new Image();
    img.onload = () => {
      addImageLayer(url, img.width, img.height);
    };
    img.src = url;
    img.crossOrigin = "anonymous";
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("layerId", id);
    e.currentTarget.style.opacity = "0.5";
  };
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("layerId");
    if (draggedId && targetId && draggedId !== targetId) {
      reorderLayers(draggedId, targetId);
    }
    setDragOverId(null);
  };
  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteLayer(id);
  };

  return (
    <div className="right-panels">
      <PanelStyles />

      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activePanel === "layers" ? "active" : ""}`}
          onClick={() => setActivePanel("layers")}
        >
          <BsLayers /> Layers
        </button>
        <button
          className={`sidebar-tab ${activePanel === "assets" ? "active" : ""}`}
          onClick={() => setActivePanel("assets")}
        >
          <BsImage /> Assets
        </button>
      </div>

      {activePanel === "layers" && (
        <div>
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
                    {layer.type === "rectangle" && <BsSquare />}
                    {layer.type === "circle" && <BsCircle />}
                    {layer.type === "image" && <BsImage />}
                  </div>
                  <span className="layer-name">
                    {layer.name || `(${layer.type} layer)`}
                  </span>
                  <button
                    className="layer-delete-button"
                    // ✅ FIX: Changed 'id' to 'layer.id' to pass the correct ID
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
      )}

      {activePanel === "assets" && (
        <div>
          <div className="assets-grid">
            {sampleAssets.map((asset) => (
              <div key={asset.url} className="asset-item" title={asset.name}>
                <img
                  src={asset.url}
                  alt={asset.name}
                  onClick={() => handleAssetClick(asset.url)}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
