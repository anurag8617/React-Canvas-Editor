import React, { useRef, useEffect } from "react";
import { drawLayers } from "../utils/canvasRenderer"; // <-- IMPORT THE NEW FUNCTION

export const PageThumbnail = ({ page, isActive, onClick, pageNumber }) => {
  const canvasRef = useRef(null);
  // We don't need a real image cache for thumbnails, just an empty map
  const thumbnailImageCache = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !page) return;
    const ctx = canvas.getContext("2d");

    const thumbnailWidth = 150;
    const thumbnailHeight = 90;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = thumbnailWidth * dpr;
    canvas.height = thumbnailHeight * dpr;
    canvas.style.width = `${thumbnailWidth}px`;
    canvas.style.height = `${thumbnailHeight}px`;
    ctx.scale(dpr, dpr);

    // Fill the background
    ctx.fillStyle = page.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, thumbnailWidth, thumbnailHeight);

    // Apply scale to fit the main content
    const logicalWidth = 1500;
    const scale = thumbnailWidth / logicalWidth;
    ctx.scale(scale, scale);

    // ✅ FIX: Use the shared drawing function
    drawLayers(ctx, page.layers, thumbnailImageCache, true); // Pass true for forThumbnail
  }, [page.layers, page.backgroundColor]);

  return (
    <div
      className={`page-thumbnail ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="thumbnail-preview" />
      <span>{pageNumber}</span>
    </div>
  );
};
