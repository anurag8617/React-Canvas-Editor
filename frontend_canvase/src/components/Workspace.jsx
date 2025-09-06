// import React, { useRef, useEffect } from "react";
// import { useEditorStore, TOOLS } from "../store";

// const {
//   setSelectedLayerId,
//   addTextLayer,
//   startTransform,
//   stopTransform,
//   updateSelectedLayer,
// } = useEditorStore.getState();

// export const Workspace = ({ onEnterEditMode, layerBoundsCache }) => {
//   const canvasRef = useRef(null);
//   const isDraggingRef = useRef(false);

//   const layers = useEditorStore((state) => state.layers);
//   const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
//   const activeTool = useEditorStore((state) => state.activeTool);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     [...layers].reverse().forEach((layer) => {
//       ctx.save();
//       ctx.translate(layer.x, layer.y);
//       ctx.rotate((Math.PI / 180) * layer.rotation);
//       ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;

//       // ✅ Apply text case transformation
//       let content = layer.content;
//       if (layer.textCase === "uppercase") content = content.toUpperCase();
//       if (layer.textCase === "lowercase") content = content.toLowerCase();

//       const lines = content.split("\n");
//       const lineHeight = layer.fontSize * 1.2;
//       let maxWidth = 0;
//       // We must measure the transformed text to get the correct bounds
//       lines.forEach((line) => {
//         const metrics = ctx.measureText(line);
//         if (metrics.width > maxWidth) maxWidth = metrics.width;
//       });
//       const textHeight = lines.length * lineHeight;
//       const bounds = { width: maxWidth, height: textHeight };
//       layerBoundsCache.current.set(layer.id, bounds);

//       const boxWidth = bounds.width + layer.padding * 2;
//       const boxHeight =
//         bounds.height + layer.padding * 2 - layer.fontSize * 0.2;

//       // Draw background (with no shadow)
//       ctx.save();
//       ctx.shadowColor = "transparent";
//       ctx.fillStyle = layer.backgroundColor;
//       ctx.fillRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
//       ctx.restore();

//       // ✅ Apply shadow properties for the text
//       if (layer.hasShadow) {
//         ctx.shadowColor = layer.shadowColor;
//         ctx.shadowBlur = layer.shadowBlur;
//         ctx.shadowOffsetX = layer.shadowOffsetX;
//         ctx.shadowOffsetY = layer.shadowOffsetY;
//       }

//       // ✅ Apply text alignment
//       ctx.textAlign = layer.textAlign;
//       ctx.fillStyle = layer.color;
//       ctx.textBaseline = "middle";

//       const startY = -boxHeight / 2 + lineHeight / 2;
//       lines.forEach((line, index) => {
//         let xPos = 0;
//         if (layer.textAlign === "left") xPos = -boxWidth / 2 + layer.padding;
//         if (layer.textAlign === "right") xPos = boxWidth / 2 - layer.padding;
//         ctx.fillText(line, xPos, startY + index * lineHeight);
//       });

//       ctx.restore();

//       // Draw transform handles (unchanged)
//       if (layer.id === selectedLayerId && activeTool === TOOLS.MOVE) {
//         ctx.save();
//         ctx.translate(layer.x, layer.y);
//         ctx.rotate((Math.PI / 180) * layer.rotation);
//         ctx.strokeStyle = "#0099ff";
//         ctx.lineWidth = 1;
//         ctx.strokeRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
//         ctx.fillStyle = "white";
//         ctx.strokeStyle = "#0099ff";
//         ctx.lineWidth = 2;
//         ctx.strokeRect(boxWidth / 2 - 5, boxHeight / 2 - 5, 10, 10);
//         ctx.fillRect(boxWidth / 2 - 5, boxHeight / 2 - 5, 10, 10);
//         ctx.beginPath();
//         ctx.moveTo(0, -boxHeight / 2);
//         ctx.lineTo(0, -boxHeight / 2 - 20);
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.arc(0, -boxHeight / 2 - 25, 5, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.stroke();
//         ctx.restore();
//       }
//     });
//   }, [layers, selectedLayerId, activeTool, layerBoundsCache]);

//   useEffect(() => {
//     // This effect is unchanged
//     const handleMouseMove = (e) => {
//       const { interactionState } = useEditorStore.getState();
//       const { mode, startPoint, originalLayer } = interactionState;
//       if (mode === "idle" || !originalLayer) return;
//       const dx = e.clientX - startPoint.x;
//       const dy = e.clientY - startPoint.y;
//       switch (mode) {
//         case "translating":
//           updateSelectedLayer("x", originalLayer.x + dx);
//           updateSelectedLayer("y", originalLayer.y + dy);
//           break;
//         case "rotating": {
//           const angle = Math.atan2(
//             e.clientY - originalLayer.y,
//             e.clientX - originalLayer.x
//           );
//           updateSelectedLayer("rotation", (angle * 180) / Math.PI + 90);
//           break;
//         }
//         case "scaling": {
//           const initialDist = Math.hypot(
//             startPoint.x - originalLayer.x,
//             startPoint.y - originalLayer.y
//           );
//           const currentDist = Math.hypot(
//             e.clientX - originalLayer.x,
//             e.clientY - originalLayer.y
//           );
//           if (initialDist < 1) return;
//           const newFontSize = Math.max(
//             8,
//             originalLayer.fontSize * (currentDist / initialDist)
//           );
//           updateSelectedLayer("fontSize", newFontSize);
//           break;
//         }
//       }
//     };
//     const handleMouseUp = () => {
//       if (useEditorStore.getState().interactionState.mode !== "idle") {
//         stopTransform();
//       }
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, []);

//   // findClickedLayer, handleMouseDown, and handleDoubleClick are unchanged
//   const findClickedLayer = (mouseX, mouseY) => {
//     for (const layer of [...layers].reverse()) {
//       const bounds = layerBoundsCache.current.get(layer.id);
//       if (!bounds) continue;
//       const angle = (-layer.rotation * Math.PI) / 180;
//       const localX =
//         (mouseX - layer.x) * Math.cos(angle) -
//         (mouseY - layer.y) * Math.sin(angle);
//       const localY =
//         (mouseX - layer.x) * Math.sin(angle) +
//         (mouseY - layer.y) * Math.cos(angle);
//       const halfW = (bounds.width + layer.padding * 2) / 2;
//       const halfH = (bounds.height + layer.padding * 2) / 2;
//       if (
//         localX > -halfW &&
//         localX < halfW &&
//         localY > -halfH &&
//         localY < halfH
//       )
//         return layer;
//     }
//     return null;
//   };

//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
//     const clickedLayer = findClickedLayer(mouseX, mouseY);
//     if (activeTool === TOOLS.TEXT) {
//       if (clickedLayer) {
//         onEnterEditMode(clickedLayer);
//       } else {
//         const newLayer = addTextLayer(mouseX, mouseY);
//         onEnterEditMode(newLayer);
//       }
//       return;
//     }
//     const selectedLayer = layers.find((l) => l.id === selectedLayerId);
//     if (selectedLayer && activeTool === TOOLS.MOVE) {
//       const angle = (-selectedLayer.rotation * Math.PI) / 180;
//       const localX =
//         (mouseX - selectedLayer.x) * Math.cos(angle) -
//         (mouseY - selectedLayer.y) * Math.sin(angle);
//       const localY =
//         (mouseX - selectedLayer.x) * Math.sin(angle) +
//         (mouseY - selectedLayer.y) * Math.cos(angle);
//       const bounds = layerBoundsCache.current.get(selectedLayer.id);
//       if (bounds) {
//         const boxWidth = bounds.width + selectedLayer.padding * 2;
//         const boxHeight = bounds.height + selectedLayer.padding * 2;
//         const handleSize = 15;
//         if (
//           localX > -handleSize &&
//           localX < handleSize &&
//           localY > -boxHeight / 2 - 30 - handleSize &&
//           localY < -boxHeight / 2 - 20 + handleSize
//         ) {
//           startTransform(
//             "rotating",
//             { x: e.clientX, y: e.clientY },
//             selectedLayer
//           );
//           return;
//         }
//         if (
//           localX > boxWidth / 2 - handleSize &&
//           localX < boxWidth / 2 + handleSize &&
//           localY > boxHeight / 2 - handleSize &&
//           localY < boxHeight / 2 + handleSize
//         ) {
//           startTransform(
//             "scaling",
//             { x: e.clientX, y: e.clientY },
//             selectedLayer
//           );
//           return;
//         }
//       }
//     }
//     if (clickedLayer) {
//       if (clickedLayer.id !== selectedLayerId)
//         setSelectedLayerId(clickedLayer.id);
//       if (activeTool === TOOLS.MOVE)
//         startTransform(
//           "translating",
//           { x: e.clientX, y: e.clientY },
//           clickedLayer
//         );
//     } else {
//       setSelectedLayerId(null);
//     }
//   };

//   const handleDoubleClick = (e) => {
//     if (activeTool === TOOLS.TEXT) return;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
//     const clickedLayer = findClickedLayer(mouseX, mouseY);
//     if (clickedLayer) onEnterEditMode(clickedLayer);
//   };

//   return (
//     <div className="workspace">
//       <canvas
//         ref={canvasRef}
//         width={1200}
//         height={800}
//         style={{
//           backgroundColor: "#2d2d2d",
//           cursor: activeTool === TOOLS.MOVE ? "move" : "text",
//         }}
//         onMouseDown={handleMouseDown}
//         onDoubleClick={handleDoubleClick}
//       />
//     </div>
//   );
// };

import React, { useRef, useEffect } from "react";
import { useEditorStore, TOOLS } from "../store";

const {
  setSelectedLayerId,
  addTextLayer,
  startTransform,
  stopTransform,
  updateSelectedLayer,
} = useEditorStore.getState();

export const Workspace = ({ onEnterEditMode, layerBoundsCache }) => {
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const layers = useEditorStore((state) => state.layers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const activeTool = useEditorStore((state) => state.activeTool);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...layers].reverse().forEach((layer) => {
      ctx.save();
      ctx.translate(layer.x, layer.y);
      ctx.rotate((Math.PI / 180) * layer.rotation);
      ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
      ctx.textAlign = layer.textAlign;
      if (layer.hasShadow) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = layer.shadowBlur;
        ctx.shadowOffsetX = layer.shadowOffsetX;
        ctx.shadowOffsetY = layer.shadowOffsetY;
      }

      let content = layer.content;
      if (layer.textCase === "uppercase") content = content.toUpperCase();
      if (layer.textCase === "lowercase") content = content.toLowerCase();

      const lines = content.split("\n");
      const lineHeight = layer.fontSize * 1.2;
      let maxWidth = 0;
      lines.forEach((line) => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxWidth) maxWidth = metrics.width;
      });

      const textHeight = lines.length * lineHeight;
      const bounds = { width: maxWidth, height: textHeight };
      layerBoundsCache.current.set(layer.id, bounds);
      const boxWidth = bounds.width + layer.padding * 2;
      const boxHeight =
        bounds.height + layer.padding * 2 - layer.fontSize * 0.2;

      ctx.save();
      ctx.shadowColor = "transparent";
      ctx.fillStyle = layer.backgroundColor;
      ctx.fillRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
      ctx.restore();

      ctx.fillStyle = layer.color;
      ctx.textBaseline = "middle";
      const startY = -boxHeight / 2 + lineHeight / 2;
      lines.forEach((line, index) => {
        let xPos = 0;
        if (layer.textAlign === "left") xPos = -boxWidth / 2 + layer.padding;
        if (layer.textAlign === "right") xPos = boxWidth / 2 - layer.padding;
        const yPos = startY + index * lineHeight;
        ctx.fillText(line, xPos, yPos);

        // ✅ Manually draw the underline if enabled
        if (layer.underline) {
          const metrics = ctx.measureText(line);
          const underlineY = yPos + metrics.actualBoundingBoxAscent / 2;
          ctx.beginPath();
          ctx.strokeStyle = layer.color;
          ctx.lineWidth = Math.max(1, layer.fontSize / 15);

          let startX = xPos;
          if (layer.textAlign === "center") startX = -metrics.width / 2;
          if (layer.textAlign === "right") startX = xPos - metrics.width;

          ctx.moveTo(startX, underlineY);
          ctx.lineTo(startX + metrics.width, underlineY);
          ctx.stroke();
        }
      });

      ctx.restore();

      // Draw transform handles (unchanged)
      if (layer.id === selectedLayerId && activeTool === TOOLS.MOVE) {
        ctx.save();
        ctx.translate(layer.x, layer.y);
        ctx.rotate((Math.PI / 180) * layer.rotation);
        ctx.strokeStyle = "#0099ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#0099ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxWidth / 2 - 5, boxHeight / 2 - 5, 10, 10);
        ctx.fillRect(boxWidth / 2 - 5, boxHeight / 2 - 5, 10, 10);
        ctx.beginPath();
        ctx.moveTo(0, -boxHeight / 2);
        ctx.lineTo(0, -boxHeight / 2 - 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -boxHeight / 2 - 25, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });
  }, [layers, selectedLayerId, activeTool, layerBoundsCache]);

  // The rest of the Workspace component is unchanged...
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { interactionState } = useEditorStore.getState();
      const { mode, startPoint, originalLayer } = interactionState;
      if (mode === "idle" || !originalLayer) return;
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;
      switch (mode) {
        case "translating":
          updateSelectedLayer("x", originalLayer.x + dx);
          updateSelectedLayer("y", originalLayer.y + dy);
          break;
        case "rotating": {
          const angle = Math.atan2(
            e.clientY - originalLayer.y,
            e.clientX - originalLayer.x
          );
          updateSelectedLayer("rotation", (angle * 180) / Math.PI + 90);
          break;
        }
        case "scaling": {
          const initialDist = Math.hypot(
            startPoint.x - originalLayer.x,
            startPoint.y - originalLayer.y
          );
          const currentDist = Math.hypot(
            e.clientX - originalLayer.x,
            e.clientY - originalLayer.y
          );
          if (initialDist < 1) return;
          const newFontSize = Math.max(
            8,
            originalLayer.fontSize * (currentDist / initialDist)
          );
          updateSelectedLayer("fontSize", newFontSize);
          break;
        }
      }
    };
    const handleMouseUp = () => {
      if (useEditorStore.getState().interactionState.mode !== "idle")
        stopTransform();
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  const findClickedLayer = (mouseX, mouseY) => {
    for (const layer of [...layers].reverse()) {
      const bounds = layerBoundsCache.current.get(layer.id);
      if (!bounds) continue;
      const angle = (-layer.rotation * Math.PI) / 180;
      const localX =
        (mouseX - layer.x) * Math.cos(angle) -
        (mouseY - layer.y) * Math.sin(angle);
      const localY =
        (mouseX - layer.x) * Math.sin(angle) +
        (mouseY - layer.y) * Math.cos(angle);
      const halfW = (bounds.width + layer.padding * 2) / 2;
      const halfH = (bounds.height + layer.padding * 2) / 2;
      if (
        localX > -halfW &&
        localX < halfW &&
        localY > -halfH &&
        localY < halfH
      )
        return layer;
    }
    return null;
  };
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const clickedLayer = findClickedLayer(mouseX, mouseY);
    if (activeTool === TOOLS.TEXT) {
      if (clickedLayer) {
        onEnterEditMode(clickedLayer);
      } else {
        const newLayer = addTextLayer(mouseX, mouseY);
        onEnterEditMode(newLayer);
      }
      return;
    }
    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (selectedLayer && activeTool === TOOLS.MOVE) {
      const angle = (-selectedLayer.rotation * Math.PI) / 180;
      const localX =
        (mouseX - selectedLayer.x) * Math.cos(angle) -
        (mouseY - selectedLayer.y) * Math.sin(angle);
      const localY =
        (mouseX - selectedLayer.x) * Math.sin(angle) +
        (mouseY - selectedLayer.y) * Math.cos(angle);
      const bounds = layerBoundsCache.current.get(selectedLayer.id);
      if (bounds) {
        const boxWidth = bounds.width + selectedLayer.padding * 2;
        const boxHeight = bounds.height + selectedLayer.padding * 2;
        const handleSize = 15;
        if (
          localX > -handleSize &&
          localX < handleSize &&
          localY > -boxHeight / 2 - 30 - handleSize &&
          localY < -boxHeight / 2 - 20 + handleSize
        ) {
          startTransform(
            "rotating",
            { x: e.clientX, y: e.clientY },
            selectedLayer
          );
          return;
        }
        if (
          localX > boxWidth / 2 - handleSize &&
          localX < boxWidth / 2 + handleSize &&
          localY > boxHeight / 2 - handleSize &&
          localY < boxHeight / 2 + handleSize
        ) {
          startTransform(
            "scaling",
            { x: e.clientX, y: e.clientY },
            selectedLayer
          );
          return;
        }
      }
    }
    if (clickedLayer) {
      if (clickedLayer.id !== selectedLayerId)
        setSelectedLayerId(clickedLayer.id);
      if (activeTool === TOOLS.MOVE)
        startTransform(
          "translating",
          { x: e.clientX, y: e.clientY },
          clickedLayer
        );
    } else {
      setSelectedLayerId(null);
    }
  };
  const handleDoubleClick = (e) => {
    if (activeTool === TOOLS.TEXT) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const clickedLayer = findClickedLayer(mouseX, mouseY);
    if (clickedLayer) onEnterEditMode(clickedLayer);
  };
  return (
    <div className="workspace">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        style={{
          backgroundColor: "#2d2d2d",
          cursor: activeTool === TOOLS.MOVE ? "move" : "text",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
