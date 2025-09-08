import React, { useRef, useEffect } from "react";
import { useEditorStore, TOOLS } from "../store";

// Helper function for text wrapping (Unchanged)
const getWrappedLines = (ctx, text, maxWidth) => {
  const lines = [];
  const paragraphs = text.split("\n");
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let currentLine = words[0] || "";
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
  }
  return lines;
};

export const Workspace = ({
  onEnterEditMode,
  layerBoundsCache,
  layers,
  backgroundColor,
}) => {
  const canvasRef = useRef(null);
  const dragStateRef = useRef(null);

  const {
    setSelectedLayerId,
    addTextLayer,
    startTransform,
    stopTransform,
    updateSelectedLayer,
  } = useEditorStore.getState();

  // useEffect for drawing. It now draws the ↺ symbol for rotation.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const selectedLayerId = useEditorStore.getState().selectedLayerId;
    const activeTool = useEditorStore.getState().activeTool;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...layers].reverse().forEach((layer) => {
      ctx.save();
      ctx.translate(layer.x, layer.y);
      ctx.rotate((Math.PI / 180) * layer.rotation);

      const boxWidth = layer.width + layer.padding * 2;
      const boxHeight = layer.height + layer.padding * 2;
      layerBoundsCache.current.set(layer.id, {
        width: boxWidth,
        height: boxHeight,
      });

      const halfW = boxWidth / 2;
      const halfH = boxHeight / 2;

      ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
      ctx.textAlign = layer.textAlign;
      if (layer.hasShadow) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = layer.shadowBlur;
        ctx.shadowOffsetX = layer.shadowOffsetX;
        ctx.shadowOffsetY = layer.shadowOffsetY;
      }

      ctx.beginPath();
      ctx.rect(-halfW, -halfH, boxWidth, boxHeight);
      ctx.clip();

      let content = layer.content || "";
      if (layer.textCase === "uppercase") content = content.toUpperCase();
      if (layer.textCase === "lowercase") content = content.toLowerCase();
      const lines = getWrappedLines(ctx, content, layer.width);
      const lineHeight = layer.fontSize * 1.2;

      ctx.fillStyle = layer.color;
      ctx.textBaseline = "middle";
      const startY = -halfH + layer.padding + lineHeight / 2;
      lines.forEach((line, index) => {
        let xPos = 0;
        if (layer.textAlign === "left") xPos = -halfW + layer.padding;
        if (layer.textAlign === "right") xPos = halfW - layer.padding;
        const yPos = startY + index * lineHeight;
        ctx.fillText(line, xPos, yPos);
        if (layer.underline) {
          const metrics = ctx.measureText(line);
          const underlineY = yPos + metrics.actualBoundingBoxAscent / 2 + 2;
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

      if (layer.id === selectedLayerId && activeTool === TOOLS.MOVE) {
        ctx.save();
        ctx.translate(layer.x, layer.y);
        ctx.rotate((Math.PI / 180) * layer.rotation);

        ctx.strokeStyle = "#0099ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(-halfW, -halfH, boxWidth, boxHeight);

        ctx.fillStyle = "white";
        ctx.lineWidth = 2;

        // ✅ Draw Rotation Handle with the ↺ symbol
        ctx.beginPath();
        ctx.moveTo(0, -halfH);
        ctx.lineTo(0, -halfH - 20);
        ctx.stroke();
        ctx.save();
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0099ff";
        ctx.fillText("↺", 0, -halfH - 25);
        ctx.restore();

        const handleSize = 10;
        ctx.fillRect(
          halfW - handleSize / 2,
          halfH - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.strokeRect(
          halfW - handleSize / 2,
          halfH - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.restore();
      }
    });
  }, [layers, layerBoundsCache]);

  // This useEffect handles all mouse events, with the final corrected logic.
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragStateRef.current) return;

      const { initialLayer, mode, startPoint } = dragStateRef.current;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;

      switch (mode) {
        case "translating": {
          const dx = (e.clientX - startPoint.x) * scaleX;
          const dy = (e.clientY - startPoint.y) * scaleY;
          updateSelectedLayer("x", initialLayer.x + dx);
          updateSelectedLayer("y", initialLayer.y + dy);
          break;
        }
        case "rotating": {
          // ✅ FIX: Use the initial start angle to calculate a smooth delta
          const { layerCenter, startAngle } = dragStateRef.current;
          const currentAngle = Math.atan2(
            e.clientY - layerCenter.y,
            e.clientX - layerCenter.x
          );
          const deltaAngle = currentAngle - startAngle;
          const newRotation =
            initialLayer.rotation + (deltaAngle * 180) / Math.PI;
          updateSelectedLayer("rotation", newRotation);
          break;
        }
        case "resizing": {
          const dx = e.clientX - startPoint.x;
          const dy = e.clientY - startPoint.y;

          const angle_rad = (-initialLayer.rotation * Math.PI) / 180;
          const rotatedDx = dx * Math.cos(angle_rad) - dy * Math.sin(angle_rad);
          const rotatedDy = dx * Math.sin(angle_rad) + dy * Math.cos(angle_rad);

          const newWidth = Math.max(
            50,
            initialLayer.width + 2 * rotatedDx * scaleX
          );
          const newHeight = Math.max(
            50,
            initialLayer.height + 2 * rotatedDy * scaleY
          );

          updateSelectedLayer("width", newWidth);
          updateSelectedLayer("height", newHeight);
          break;
        }
      }
    };

    const handleMouseUp = () => {
      if (dragStateRef.current) {
        dragStateRef.current = null;
        stopTransform();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [stopTransform, updateSelectedLayer]);

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
      if (
        localX > -bounds.width / 2 &&
        localX < bounds.width / 2 &&
        localY > -bounds.height / 2 &&
        localY < bounds.height / 2
      ) {
        return layer;
      }
    }
    return null;
  };

  // handleMouseDown now stores the initial rotation angle for smoother dragging.
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const activeTool = useEditorStore.getState().activeTool;
    const selectedLayerId = useEditorStore.getState().selectedLayerId;
    const clickedLayer = findClickedLayer(mouseX, mouseY);

    if (activeTool === TOOLS.TEXT) {
      if (clickedLayer) onEnterEditMode(clickedLayer);
      else onEnterEditMode(addTextLayer(mouseX, mouseY));
      return;
    }

    if (!clickedLayer) {
      setSelectedLayerId(null);
      return;
    }

    if (clickedLayer.id !== selectedLayerId)
      setSelectedLayerId(clickedLayer.id);

    if (activeTool === TOOLS.MOVE) {
      const bounds = layerBoundsCache.current.get(clickedLayer.id);
      if (!bounds) return;

      const angle = (-clickedLayer.rotation * Math.PI) / 180;
      const localX =
        (mouseX - clickedLayer.x) * Math.cos(angle) -
        (mouseY - clickedLayer.y) * Math.sin(angle);
      const localY =
        (mouseX - clickedLayer.x) * Math.sin(angle) +
        (mouseY - clickedLayer.y) * Math.cos(angle);
      const halfW = bounds.width / 2;
      const halfH = bounds.height / 2;
      const handleSize = 20; // Increased hit area for easier clicking

      if (Math.hypot(localX, localY + halfH) < handleSize + 25) {
        const layerCenterX_screen =
          rect.left + (clickedLayer.x / canvasRef.current.width) * rect.width;
        const layerCenterY_screen =
          rect.top + (clickedLayer.y / canvasRef.current.height) * rect.height;
        // ✅ FIX: Store the starting angle of the mouse click
        const startAngle = Math.atan2(
          e.clientY - layerCenterY_screen,
          e.clientX - layerCenterX_screen
        );

        dragStateRef.current = {
          mode: "rotating",
          initialLayer: { ...clickedLayer },
          layerCenter: { x: layerCenterX_screen, y: layerCenterY_screen },
          startAngle: startAngle, // Store it here
        };
        startTransform("rotating");
      } else if (Math.hypot(localX - halfW, localY - halfH) < handleSize) {
        dragStateRef.current = {
          mode: "resizing",
          initialLayer: { ...clickedLayer },
          startPoint: { x: e.clientX, y: e.clientY },
        };
        startTransform("resizing");
      } else {
        dragStateRef.current = {
          mode: "translating",
          initialLayer: { ...clickedLayer },
          startPoint: { x: e.clientX, y: e.clientY },
        };
        startTransform("translating");
      }
    }
  };

  const handleDoubleClick = (e) => {
    const activeTool = useEditorStore.getState().activeTool;
    if (activeTool === TOOLS.TEXT) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const clickedLayer = findClickedLayer(mouseX, mouseY);
    if (clickedLayer) onEnterEditMode(clickedLayer);
  };

  return (
    <div className="workspace">
      <canvas
        ref={canvasRef}
        width={1500}
        height={900}
        style={{
          backgroundColor,
          cursor: "default",
          aspectRatio: "5 / 3",
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "calc(100% - 20px)",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
