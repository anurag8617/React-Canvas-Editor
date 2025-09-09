import React, { useRef, useEffect, useState } from "react";
import { useEditorStore, TOOLS } from "../store";

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

const fillTextWithSpacing = (ctx, text, x, y, spacing) => {
  if (!spacing || spacing === 0) {
    ctx.fillText(text, x, y);
    return;
  }
  const textWidth = ctx.measureText(text).width;
  const totalSpacing = (text.length - 1) * spacing;
  const totalWidth = textWidth + totalSpacing;
  let currentPosition = x;
  if (ctx.textAlign === "center") {
    currentPosition = x - totalWidth / 2;
  } else if (ctx.textAlign === "right") {
    currentPosition = x - totalWidth;
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, currentPosition, y);
    currentPosition += ctx.measureText(char).width + spacing;
  }
};

export const Workspace = ({ onEnterEditMode }) => {
  const canvasRef = useRef(null);
  const dragStateRef = useRef(null);
  const layerBoundsCache = useRef(new Map());
  const imageCache = useRef(new Map());
  const [forceUpdate, setForceUpdate] = useState(0);

  const layers = useEditorStore(
    (state) => state.pages[state.activePageIndex]?.layers || []
  );
  const backgroundColor = useEditorStore(
    (state) => state.pages[state.activePageIndex]?.backgroundColor || "#ffffff"
  );
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const activeTool = useEditorStore((state) => state.activeTool);
  const {
    setSelectedLayerId,
    addTextLayer,
    addRectangleLayer,
    addCircleLayer,
    updateSelectedLayer,
  } = useEditorStore.getState();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const container = canvas.parentElement;
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      const aspectRatio = 1500 / 900;
      let newWidth = width;
      let newHeight = width / aspectRatio;
      if (newHeight > height) {
        newHeight = height;
        newWidth = height * aspectRatio;
      }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      context.scale(dpr, dpr);

      // ✅ FIX 1: Force a re-draw after resizing the canvas when a sidebar is toggled.
      setForceUpdate((c) => c + 1);
    };
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    resizeCanvas();
    return () => resizeObserver.disconnect();
  }, []); // This empty dependency array is correct.

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width: displayWidth, height: displayHeight } =
      canvas.getBoundingClientRect();

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const logicalWidth = 1500;
    const scale = displayWidth / logicalWidth;
    ctx.save();
    ctx.scale(scale, scale);

    layers.forEach((layer) => {
      ctx.save();
      ctx.translate(layer.x, layer.y);
      ctx.rotate((Math.PI / 180) * layer.rotation);
      if (layer.type === "text") {
        ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.textAlign = layer.textAlign;

        let content = layer.content || "";
        if (layer.textCase === "uppercase") content = content.toUpperCase();
        if (layer.textCase === "lowercase") content = content.toLowerCase();

        const lines = getWrappedLines(ctx, content, layer.width);
        const lineHeight = layer.fontSize * layer.lineHeight;

        // ✅ FIX 2: Dynamically calculate the text box height based on content.
        const calculatedHeight = lines.length * lineHeight;
        const boxWidth = layer.width + layer.padding * 2;
        const boxHeight = calculatedHeight + layer.padding * 2; // Use the real height

        // This ensures the blue selection box will have the correct size.
        layerBoundsCache.current.set(layer.id, {
          width: boxWidth,
          height: boxHeight,
        });

        const halfW = boxWidth / 2,
          halfH = boxHeight / 2;

        if (layer.hasShadow) {
          ctx.shadowColor = layer.shadowColor;
          ctx.shadowBlur = layer.shadowBlur;
          ctx.shadowOffsetX = layer.shadowOffsetX;
          ctx.shadowOffsetY = layer.shadowOffsetY;
        }

        // Clip the drawing area to the dynamically calculated box height
        ctx.beginPath();
        ctx.rect(-halfW, -halfH, boxWidth, boxHeight);
        ctx.clip();

        ctx.fillStyle = layer.color;
        ctx.textBaseline = "middle";
        const startY = -halfH + layer.padding + lineHeight / 2;
        lines.forEach((line, index) => {
          const xPos =
            layer.textAlign === "left"
              ? -halfW + layer.padding
              : layer.textAlign === "right"
              ? halfW - layer.padding
              : 0;
          const yPos = startY + index * lineHeight;
          fillTextWithSpacing(ctx, line, xPos, yPos, layer.letterSpacing);
          if (layer.underline) {
            const textWidth =
              ctx.measureText(line).width +
              (line.length - 1) * layer.letterSpacing;
            const underlineY = yPos + layer.fontSize / 2;
            let startX = xPos;
            if (layer.textAlign === "center") startX = xPos - textWidth / 2;
            if (layer.textAlign === "right") startX = xPos - textWidth;
            ctx.beginPath();
            ctx.strokeStyle = layer.color;
            ctx.lineWidth = Math.max(1, layer.fontSize / 15);
            ctx.moveTo(startX, underlineY);
            ctx.lineTo(startX + textWidth, underlineY);
            ctx.stroke();
          }
        });
      } else if (layer.type === "rectangle") {
        layerBoundsCache.current.set(layer.id, {
          width: layer.width,
          height: layer.height,
        });
        const halfW = layer.width / 2,
          halfH = layer.height / 2;
        if (layer.fillColor) {
          ctx.fillStyle = layer.fillColor;
          ctx.fillRect(-halfW, -halfH, layer.width, layer.height);
        }
        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeRect(-halfW, -halfH, layer.width, layer.height);
        }
      } else if (layer.type === "circle") {
        layerBoundsCache.current.set(layer.id, {
          width: layer.radius * 2,
          height: layer.radius * 2,
        });
        ctx.beginPath();
        ctx.arc(0, 0, layer.radius, 0, 2 * Math.PI);
        if (layer.fillColor) {
          ctx.fillStyle = layer.fillColor;
          ctx.fill();
        }
        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth;
          ctx.stroke();
        }
      } else if (layer.type === "image") {
        layerBoundsCache.current.set(layer.id, {
          width: layer.width,
          height: layer.height,
        });
        const cachedImage = imageCache.current.get(layer.src);
        if (cachedImage) {
          ctx.drawImage(
            cachedImage,
            -layer.width / 2,
            -layer.height / 2,
            layer.width,
            layer.height
          );
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = layer.src;
          img.onload = () => {
            imageCache.current.set(layer.src, img);
            setForceUpdate((c) => c + 1);
          };
          ctx.fillStyle = "#cccccc";
          ctx.fillRect(
            -layer.width / 2,
            -layer.height / 2,
            layer.width,
            layer.height
          );
        }
      }
      ctx.restore();
    });

    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (selectedLayer && activeTool === TOOLS.MOVE) {
      const bounds = layerBoundsCache.current.get(selectedLayer.id);
      if (bounds) {
        const halfW = bounds.width / 2,
          halfH = bounds.height / 2;
        ctx.save();
        ctx.translate(selectedLayer.x, selectedLayer.y);
        ctx.rotate((Math.PI / 180) * selectedLayer.rotation);
        ctx.strokeStyle = "#0099ff";
        ctx.lineWidth = 2 / scale;
        ctx.strokeRect(-halfW, -halfH, bounds.width, bounds.height);
        ctx.beginPath();
        ctx.moveTo(0, -halfH);
        ctx.lineTo(0, -halfH - 20 / scale);
        ctx.stroke();
        ctx.save();
        ctx.font = `${24 / scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0099ff";
        ctx.fillText("↺", 0, -halfH - 30 / scale);
        ctx.restore();
        const handleSize = 10 / scale;
        const handles = [
          { x: -halfW, y: -halfH, name: "tl" },
          { x: 0, y: -halfH, name: "tm" },
          { x: halfW, y: -halfH, name: "tr" },
          { x: halfW, y: 0, name: "mr" },
          { x: halfW, y: halfH, name: "br" },
          { x: 0, y: halfH, name: "bm" },
          { x: -halfW, y: halfH, name: "bl" },
          { x: -halfW, y: 0, name: "ml" },
        ];
        ctx.fillStyle = "white";
        handles.forEach((handle) => {
          ctx.fillRect(
            handle.x - handleSize / 2,
            handle.y - handleSize / 2,
            handleSize,
            handleSize
          );
          ctx.strokeRect(
            handle.x - handleSize / 2,
            handle.y - handleSize / 2,
            handleSize,
            handleSize
          );
        });
        ctx.restore();
      }
    }
    ctx.restore();
  }, [layers, backgroundColor, selectedLayerId, activeTool, forceUpdate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragStateRef.current) return;
      const { initialLayer, mode, startPoint, handle } = dragStateRef.current;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const logicalWidth = 1500;
      const scale = rect.width / logicalWidth;
      const dx = (e.clientX - startPoint.x) / scale;
      const dy = (e.clientY - startPoint.y) / scale;
      if (mode === "translating") {
        updateSelectedLayer("x", initialLayer.x + dx);
        updateSelectedLayer("y", initialLayer.y + dy);
      } else if (mode === "rotating") {
        const { layerCenter, startAngle } = dragStateRef.current;
        const currentAngle = Math.atan2(
          e.clientY - layerCenter.y,
          e.clientX - layerCenter.x
        );
        const deltaAngle = currentAngle - startAngle;
        updateSelectedLayer(
          "rotation",
          initialLayer.rotation + (deltaAngle * 180) / Math.PI
        );
      } else if (mode === "resizing") {
        const angle_rad = (initialLayer.rotation * Math.PI) / 180,
          cos_a = Math.cos(angle_rad),
          sin_a = Math.sin(angle_rad);
        const rotatedDx = dx * cos_a + dy * sin_a;
        const rotatedDy = dy * cos_a - dx * sin_a;
        if (initialLayer.type === "circle") {
          const delta = (rotatedDx + rotatedDy) / 2;
          const newRadius = Math.max(10, initialLayer.radius + delta);
          updateSelectedLayer("radius", newRadius);
        } else {
          let newX = initialLayer.x,
            newY = initialLayer.y,
            newWidth = initialLayer.width,
            newHeight = initialLayer.height;
          if (handle.includes("l")) {
            newWidth -= rotatedDx;
            newX += (rotatedDx / 2) * cos_a;
            newY += (rotatedDx / 2) * sin_a;
          }
          if (handle.includes("r")) {
            newWidth += rotatedDx;
            newX += (rotatedDx / 2) * cos_a;
            newY += (rotatedDx / 2) * sin_a;
          }
          if (handle.includes("t")) {
            newHeight -= rotatedDy;
            newX -= (rotatedDy / 2) * sin_a;
            newY += (rotatedDy / 2) * cos_a;
          }
          if (handle.includes("b")) {
            newHeight += rotatedDy;
            newX -= (rotatedDy / 2) * sin_a;
            newY += (rotatedDy / 2) * cos_a;
          }
          if (newWidth > 20) {
            updateSelectedLayer("width", newWidth);
            updateSelectedLayer("x", newX);
          }
          if (newHeight > 20) {
            updateSelectedLayer("height", newHeight);
            updateSelectedLayer("y", newY);
          }
        }
      }
    };
    const handleMouseUp = () => {
      dragStateRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateSelectedLayer]);

  const findClickTarget = (mouseX, mouseY, scale) => {
    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (selectedLayer && activeTool === TOOLS.MOVE) {
      const bounds = layerBoundsCache.current.get(selectedLayer.id);
      if (!bounds) return { layer: null, handle: null };
      const halfW = bounds.width / 2,
        halfH = bounds.height / 2;
      const angle = (-selectedLayer.rotation * Math.PI) / 180;
      const localX =
        (mouseX - selectedLayer.x) * Math.cos(angle) -
        (mouseY - selectedLayer.y) * Math.sin(angle);
      const localY =
        (mouseX - selectedLayer.x) * Math.sin(angle) +
        (mouseY - selectedLayer.y) * Math.cos(angle);
      if (Math.hypot(localX, localY + halfH + 20 / scale) < 20 / scale)
        return { layer: selectedLayer, handle: "rotate" };
      const handleSize = 20 / scale;
      const handles = [
        { x: -halfW, y: -halfH, name: "tl" },
        { x: 0, y: -halfH, name: "tm" },
        { x: halfW, y: -halfH, name: "tr" },
        { x: halfW, y: 0, name: "mr" },
        { x: halfW, y: halfH, name: "br" },
        { x: 0, y: halfH, name: "bm" },
        { x: -halfW, y: halfH, name: "bl" },
        { x: -halfW, y: 0, name: "ml" },
      ];
      for (const handle of handles) {
        if (Math.hypot(localX - handle.x, localY - handle.y) < handleSize)
          return { layer: selectedLayer, handle: handle.name };
      }
    }
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
        Math.abs(localX) < bounds.width / 2 &&
        Math.abs(localY) < bounds.height / 2
      )
        return { layer, handle: "translate" };
    }
    return { layer: null, handle: null };
  };

  const handleDoubleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const logicalWidth = 1500;
    const scale = rect.width / logicalWidth;
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;
    const { layer: clickedLayer } = findClickTarget(mouseX, mouseY, scale);
    if (clickedLayer && clickedLayer.type === "text") {
      onEnterEditMode(clickedLayer);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const logicalWidth = 1500;
    const scale = rect.width / logicalWidth;
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    if (activeTool === TOOLS.MOVE) {
      const { layer: clickedLayer, handle } = findClickTarget(
        mouseX,
        mouseY,
        scale
      );
      if (clickedLayer) {
        if (clickedLayer.id !== selectedLayerId) {
          setSelectedLayerId(clickedLayer.id);
        }
        if (handle) {
          const commonDragState = {
            initialLayer: { ...clickedLayer },
            startPoint: { x: e.clientX, y: e.clientY },
          };
          if (handle === "rotate") {
            const layerCenterX_screen = rect.left + clickedLayer.x * scale;
            const layerCenterY_screen = rect.top + clickedLayer.y * scale;
            const startAngle = Math.atan2(
              e.clientY - layerCenterY_screen,
              e.clientX - layerCenterX_screen
            );
            dragStateRef.current = {
              ...commonDragState,
              mode: "rotating",
              layerCenter: { x: layerCenterX_screen, y: layerCenterY_screen },
              startAngle,
            };
          } else if (handle === "translate") {
            dragStateRef.current = { ...commonDragState, mode: "translating" };
          } else {
            dragStateRef.current = {
              ...commonDragState,
              mode: "resizing",
              handle,
            };
          }
        }
      } else {
        setSelectedLayerId(null);
      }
    } else if (activeTool === TOOLS.TEXT) {
      onEnterEditMode(addTextLayer(mouseX, mouseY));
    } else if (activeTool === TOOLS.RECTANGLE) {
      addRectangleLayer(mouseX, mouseY);
    } else if (activeTool === TOOLS.CIRCLE) {
      addCircleLayer(mouseX, mouseY);
    }
  };

  return (
    <div className="workspace">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
