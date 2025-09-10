// This is a shared helper function for wrapping text.
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

// This is a shared helper function for text with letter spacing.
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

/**
 * This is the main, shared drawing function.
 * Both the Workspace and the Thumbnails will use this.
 */
export const drawLayers = (ctx, layers, imageCache, forThumbnail = false) => {
  layers.forEach((layer) => {
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((Math.PI / 180) * layer.rotation);

    switch (layer.type) {
      case "text": {
        const boxWidth = layer.width + layer.padding * 2;
        const boxHeight = layer.height + layer.padding * 2;
        const halfW = boxWidth / 2,
          halfH = boxHeight / 2;
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
        const lineHeight = layer.fontSize * layer.lineHeight;
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
        break;
      }
      case "rectangle": {
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
        break;
      }
      case "circle": {
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
        break;
      }
      case "image": {
        if (forThumbnail) {
          ctx.fillStyle = "#ffffffff";
          ctx.fillRect(
            -layer.width / 2,
            -layer.height / 2,
            layer.width,
            layer.height
          );
        } else {
          const cachedImage = imageCache.current.get(layer.src);
          if (cachedImage) {
            ctx.drawImage(
              cachedImage,
              -layer.width / 2,
              -layer.height / 2,
              layer.width,
              layer.height
            );
          }
        }
        break;
      }
    }
    ctx.restore();
  });
};
