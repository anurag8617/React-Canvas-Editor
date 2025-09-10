

import React, { useState } from "react";
import { useEditorStore } from "../store";
// ICONS: BsDropletFill is used by both text and shape options.
import {
  BsTypeBold,
  BsTypeUnderline,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsDropletFill,
  BsShadows,
  BsArrowsAngleExpand,
  BsTextParagraph,
  BsArrowLeftRight,
} from "react-icons/bs";

const fontFamilies = [
  "Roboto", 
  "Lato",
  "Montserrat",
  "Oswald",
  "Lobster",
  "Playfair Display",
  "Source Code Pro",
  "Arial",
  "Georgia",
  "Inter",
  "Poppins",
  "Nunito Sans",
  "DM Sans",
  "Work Sans",
  "Space Grotesk",
  "Playfair Display",
  "Cormorant Garamond",
  "Pacifico",
  "Righteous",
];

export const OptionsBar = () => {
  const updateSelectedLayer = useEditorStore(
    (state) => state.updateSelectedLayer
  );
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const activePage = useEditorStore(
    (state) => state.pages[state.activePageIndex]
  );
  const updatePageBackgroundColor = useEditorStore(
    (state) => state.updatePageBackgroundColor
  );
  const updateActivePage = useEditorStore((state) => state.updateActivePage);

  const selectedLayer = activePage?.layers.find(
    (l) => l.id === selectedLayerId
  );
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);

  // --- Helper Functions ---
  // Moved handleNumberChange here so both text and shape options can access it.
  const handleNumberChange = (prop, val) => {
    updateSelectedLayer(prop, Number(val) || 0);
  };

  // --- Design Styles ---
  const ds = {
    // Main bar style (applied via className in root divs)
    group: { display: "flex", alignItems: "center", gap: "4px" },
    controlWrapper: {
      display: "flex",
      flexDirection: "column",
      fontSize: "12px",
      color: "#e0e0e0",
      gap: "4px",
    },
    label: {
      fontSize: "10px",
      color: "#9e9e9e",
      textTransform: "uppercase",
      userSelect: "none",
    },
    iconButton: (active = false) => ({
      background: active ? "#b53b74" : "#3f3f3f",
      color: active ? "#ffffff" : "#e0e0e0",
      border: "1px solid",
      borderColor: active ? "#b53b74" : "#555",
      padding: "5px",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    inputNumber: {
      width: "55px",
      border: "1px solid #555",
      background: "#3f3f3f",
      color: "#e0e0e0",
      borderRadius: "6px",
      padding: "6px",
      textAlign: "center",
      fontSize: "12px",
    },
    fontPickerWrapper: { position: "relative" },
    fontPickerButton: {
      padding: "6px 10px",
      background: "#3f3f3f",
      border: "1px solid #555",
      color: "#e0e0e0",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "12px",
    },
    fontPickerDropdown: {
      position: "absolute",
      top: "110%",
      left: 0,
      background: "#383838",
      border: "1px solid #1a1a1a",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      zIndex: 10,
      maxHeight: "200px",
      overflowY: "auto",
      width: "180px",
      padding: "4px",
    },
    fontListItem: {
      fontFamily: "inherit",
      padding: "8px 12px",
      border: "none",
      background: "transparent",
      color: "#e0e0e0",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "12px",
    },
    colorInput: {
      width: "28px",
      height: "28px",
      border: "none",
      padding: "0",
      background: "transparent",
      cursor: "pointer",
    },
    shadowGroup: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "1px solid #555",
      color: "#e0e0e0",
      borderRadius: "6px",
      padding: "2px 8px",
    },
  };

  // --- Render Logic ---

  // 1. Page options (if no layer selected)
  if (!selectedLayer) {
    return (
      <div className="options-bar">
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Background</label>
          <div
            style={{
              ...ds.group,
              border: "1px solid #555",
              borderRadius: "6px",
              padding: "2px 5px",
              width: "fit-content",
            }}
          >
            <BsDropletFill style={{ color: activePage.backgroundColor }} />
            <input
              type="color"
              style={ds.colorInput}
              value={activePage.backgroundColor}
              onChange={(e) => updatePageBackgroundColor(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Text layer options
  if (selectedLayer.type === "text") {
    // Text-specific helper functions
    const toggleBold = () =>
      updateSelectedLayer(
        "fontWeight",
        selectedLayer.fontWeight === "bold" ? "normal" : "bold"
      );
    const toggleUnderline = () =>
      updateSelectedLayer("underline", !selectedLayer.underline);
    const handleFontSelect = (font) => {
      updateSelectedLayer("fontFamily", font);
      setIsFontPickerOpen(false);
    };

    return (
      <div className="options-bar">
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Font Family</label>
          <div style={ds.fontPickerWrapper}>
            <button
              style={{
                ...ds.fontPickerButton,
                fontFamily: selectedLayer.fontFamily,
              }}
              onClick={() => setIsFontPickerOpen(!isFontPickerOpen)}
            >
              {selectedLayer.fontFamily}{" "}
              <span style={{ fontSize: "10px" }}>▼</span>
            </button>
            {isFontPickerOpen && (
              <div style={ds.fontPickerDropdown}>
                {fontFamilies.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontSelect(font)}
                    style={{ ...ds.fontListItem, fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={ds.group}>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Size</label>
            <input
              type="number"
              style={ds.inputNumber}
              value={selectedLayer.fontSize}
              onChange={(e) => handleNumberChange("fontSize", e.target.value)}
            />
          </div>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Color</label>
            <div
              style={{ ...ds.group, ...ds.iconButton(), padding: "2px 5px" }}
            >
              <BsDropletFill style={{ color: selectedLayer.color }} />
              <input
                type="color"
                style={ds.colorInput}
                value={selectedLayer.color}
                onChange={(e) => updateSelectedLayer("color", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={ds.group}>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Style</label>
            <div style={ds.group}>
              <button
                onClick={toggleBold}
                style={ds.iconButton(selectedLayer.fontWeight === "bold")}
              >
                <BsTypeBold size={18} />
              </button>
              <button
                onClick={toggleUnderline}
                style={ds.iconButton(selectedLayer.underline)}
              >
                <BsTypeUnderline size={18} />
              </button>
            </div>
          </div>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Align</label>
            <div style={ds.group}>
              <button
                onClick={() => updateSelectedLayer("textAlign", "left")}
                style={ds.iconButton(selectedLayer.textAlign === "left")}
              >
                <BsTextLeft size={18} />
              </button>
              <button
                onClick={() => updateSelectedLayer("textAlign", "center")}
                style={ds.iconButton(selectedLayer.textAlign === "center")}
              >
                <BsTextCenter size={18} />
              </button>
              <button
                onClick={() => updateSelectedLayer("textAlign", "right")}
                style={ds.iconButton(selectedLayer.textAlign === "right")}
              >
                <BsTextRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div style={ds.group}>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Padding</label>
            <div
              style={{
                ...ds.group,
                border: "1px solid #555",
                borderRadius: "6px",
                padding: "2px 2px 2px 8px",
              }}
            >
              <BsArrowsAngleExpand size={18} />
              <input
                type="number"
                style={{ ...ds.inputNumber, border: "none", width: "45px" }}
                value={selectedLayer.padding}
                onChange={(e) => handleNumberChange("padding", e.target.value)}
              />
            </div>
          </div>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Line Height</label>
            <div
              style={{
                ...ds.group,
                border: "1px solid #555",
                borderRadius: "6px",
                padding: "2px 2px 2px 8px",
              }}
            >
              <BsTextParagraph size={18} />
              <input
                type="number"
                step="0.1"
                style={{ ...ds.inputNumber, border: "none", width: "45px" }}
                value={selectedLayer.lineHeight}
                onChange={(e) =>
                  handleNumberChange("lineHeight", e.target.value)
                }
              />
            </div>
          </div>
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Spacing</label>
            <div
              style={{
                ...ds.group,
                border: "1px solid #555",
                borderRadius: "6px",
                padding: "2px 2px 2px 8px",
              }}
            >
              <BsArrowLeftRight size={18} />
              <input
                type="number"
                style={{ ...ds.inputNumber, border: "none", width: "45px" }}
                value={selectedLayer.letterSpacing}
                onChange={(e) =>
                  handleNumberChange("letterSpacing", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div style={ds.controlWrapper}>
          <label style={ds.label}>Shadow</label>
          <div
            style={{
              ...ds.shadowGroup,
              opacity: selectedLayer.hasShadow ? 1 : 0.6,
            }}
          >
            <BsShadows size={18} />
            <input
              type="checkbox"
              checked={selectedLayer.hasShadow}
              onChange={(e) =>
                updateSelectedLayer("hasShadow", e.target.checked)
              }
            />
            <input
              type="color"
              style={ds.colorInput}
              disabled={!selectedLayer.hasShadow}
              value={selectedLayer.shadowColor}
              onChange={(e) =>
                updateSelectedLayer("shadowColor", e.target.value)
              }
            />
            <input
              type="range"
              disabled={!selectedLayer.hasShadow}
              min="0"
              max="40"
              value={selectedLayer.shadowBlur}
              onChange={(e) => handleNumberChange("shadowBlur", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }


  // 2a. Curved Text layer options (if you have a separate type for it)
  if (selectedLayer.type === "curvetext") {
    // You can copy most of the options from your regular text block
    // For simplicity, we'll just show the unique 'Curve Radius' option here
    return (
      <div className="options-bar">
        {/* You would have Font, Size, Color, etc. controls here too */}

        <div style={ds.controlWrapper}>
          <label style={ds.label}>Curve Radius</label>
          <input
            type="number"
            style={ds.inputNumber}
            value={selectedLayer.curveRadius}
            onChange={(e) => handleNumberChange("curveRadius", e.target.value)}
          />
        </div>

        {/* Add other text controls (font, size, color) as needed */}
      </div>
    );
  }

  // 4. Shape layer options (rectangle or circle) - NEWLY ADDED BLOCK
  if (selectedLayer.type === "rectangle" || selectedLayer.type === "circle") {
    const isRect = selectedLayer.type === "rectangle";

    return (
      <div className="options-bar">
        {/* Fill Color */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Fill Color</label>
          <div style={{ ...ds.group, ...ds.iconButton(), padding: "2px 5px" }}>
            <BsDropletFill style={{ color: selectedLayer.fillColor }} />
            <input
              type="color"
              style={ds.colorInput}
              value={selectedLayer.fillColor}
              onChange={(e) => updateSelectedLayer("fillColor", e.target.value)}
            />
          </div>
        </div>

        {/* Stroke Color */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Stroke Color</label>
          <div style={{ ...ds.group, ...ds.iconButton(), padding: "2px 5px" }}>
            <BsDropletFill style={{ color: selectedLayer.strokeColor }} />
            <input
              type="color"
              style={ds.colorInput}
              value={selectedLayer.strokeColor}
              onChange={(e) =>
                updateSelectedLayer("strokeColor", e.target.value)
              }
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Stroke Width</label>
          <input
            type="number"
            style={ds.inputNumber}
            value={selectedLayer.strokeWidth}
            onChange={(e) => handleNumberChange("strokeWidth", e.target.value)}
          />
        </div>

        {/* Dimensions: Width/Height for Rect, Radius for Circle */}
        {isRect ? (
          <>
            <div style={ds.controlWrapper}>
              <label style={ds.label}>Width</label>
              <input
                type="number"
                style={ds.inputNumber}
                value={selectedLayer.width}
                onChange={(e) => handleNumberChange("width", e.target.value)}
              />
            </div>
            <div style={ds.controlWrapper}>
              <label style={ds.label}>Height</label>
              <input
                type="number"
                style={ds.inputNumber}
                value={selectedLayer.height}
                onChange={(e) => handleNumberChange("height", e.target.value)}
              />
            </div>
          </>
        ) : (
          <div style={ds.controlWrapper}>
            <label style={ds.label}>Radius</label>
            <input
              type="number"
              style={ds.inputNumber}
              value={selectedLayer.radius}
              onChange={(e) => handleNumberChange("radius", e.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  // 4. Fallback message
  return <div className="options-bar">Select a layer to see properties.</div>;
};
