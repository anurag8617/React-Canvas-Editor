import React, { useState } from "react";
import { useEditorStore } from "../store";
// ICONS
import {
  BsTypeBold,
  BsTypeUnderline,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsDropletFill,
  BsShadows,
  BsArrowsAngleExpand,
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
  // YOUR ORIGINAL LOGIC - UNCHANGED
  const updateSelectedLayer = useEditorStore(
    (state) => state.updateSelectedLayer
  );
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const activePage = useEditorStore(
    (state) => state.pages[state.activePageIndex]
  );
  const updateActivePage = useEditorStore((state) => state.updateActivePage);

  const selectedLayer = activePage?.layers.find(
    (l) => l.id === selectedLayerId
  );

  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);

  // --- DESIGN STYLES ---
  const ds = {
    bar: {
      // height: "100%",
      background: "#2a2a2a", // Changed
      borderBottom: "1px solid #1a1a1a", // Changed
      padding: "8px",
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      flexWrap: "wrap",
      color: "#e0e0e0", // Changed
    },
    group: { display: "flex", alignItems: "center", gap: "4px" },
    separator: {
      width: "1px",
      height: "40px",
      background: "#3f3f3f", // Changed
      alignSelf: "center",
    },
    controlWrapper: {
      display: "flex",
      flexDirection: "column",
      fontSize: "12px",
      color: "#e0e0e0", // Changed
      gap: "4px",
    },
    label: {
      fontSize: "10px",
      color: "#9e9e9e", // Changed
      textTransform: "uppercase",
      userSelect: "none",
    },
    iconButton: (active = false) => ({
      background: active ? "#b53b74" : "#3f3f3f", // Changed
      color: active ? "#ffffff" : "#e0e0e0", // Changed
      border: "1px solid",
      borderColor: active ? "#b53b74" : "#555", // Changed
      padding: "5px",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    inputNumber: {
      width: "55px",
      border: "1px solid #555", // Changed
      background: "#3f3f3f", // Changed
      color: "#e0e0e0", // Changed
      borderRadius: "6px",
      padding: "6px",
      textAlign: "center",
      fontSize: "12px",
    },
    fontPickerWrapper: { position: "relative" },
    fontPickerButton: {
      padding: "6px 10px",
      background: "#3f3f3f", // Changed
      border: "1px solid #555", // Changed
      color: "#e0e0e0", // Changed
      borderRadius: "6px",
      cursor: "pointer",
      width: "160px",
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
      background: "#383838", // Changed
      border: "1px solid #1a1a1a", // Changed
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)", // Changed
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
      color: "#e0e0e0", // Changed
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
      border: "1px solid #555", // Changed
      color: "#e0e0e0", // Changed
      borderRadius: "6px",
      padding: "2px 8px",
    },
  };

  // Page options
  if (!selectedLayer) {
    return (
      <div style={ds.bar}>
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Background</label>
          <div
            style={{
              ...ds,
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "2px",
            }}
          >
            <BsDropletFill style={{ color: activePage.backgroundColor }} />
            <input
              type="color"
              style={ds.colorInput}
              value={activePage.backgroundColor}
              onChange={(e) =>
                updateActivePage("backgroundColor", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // Text layer options
  if (selectedLayer.type === "text") {
    // YOUR ORIGINAL HELPER FUNCTIONS - UNCHANGED
    const handleNumberChange = (prop, val) =>
      updateSelectedLayer(prop, Number(val) || 0);
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
      <div style={ds.bar}>
        {/* Font Picker */}
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

        {/* Font Size */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Size</label>
          <input
            type="number"
            style={ds.inputNumber}
            value={selectedLayer.fontSize}
            onChange={(e) => handleNumberChange("fontSize", e.target.value)}
            title="Font Size"
          />
        </div>

        {/* Bold / Underline */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Style</label>
          <div style={ds.group}>
            <button
              onClick={toggleBold}
              style={ds.iconButton(selectedLayer.fontWeight === "bold")}
              title="Bold"
            >
              <BsTypeBold size={18} />
            </button>
            <button
              onClick={toggleUnderline}
              style={ds.iconButton(selectedLayer.underline)}
              title="Underline"
            >
              <BsTypeUnderline size={18} />
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Color</label>
          <div style={{ ...ds.group, ...ds.iconButton(), padding: "2px 5px" }}>
            <BsDropletFill style={{ color: selectedLayer.color }} />
            <input
              type="color"
              style={ds.colorInput}
              value={selectedLayer.color}
              onChange={(e) => updateSelectedLayer("color", e.target.value)}
              title="Text Color"
            />
          </div>
        </div>

        {/* Align */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Align</label>
          <div style={ds.group}>
            <button
              onClick={() => updateSelectedLayer("textAlign", "left")}
              style={ds.iconButton(selectedLayer.textAlign === "left")}
              title="Align Left"
            >
              <BsTextLeft size={18} />
            </button>
            <button
              onClick={() => updateSelectedLayer("textAlign", "center")}
              style={ds.iconButton(selectedLayer.textAlign === "center")}
              title="Align Center"
            >
              <BsTextCenter size={18} />
            </button>
            <button
              onClick={() => updateSelectedLayer("textAlign", "right")}
              style={ds.iconButton(selectedLayer.textAlign === "right")}
              title="Align Right"
            >
              <BsTextRight size={18} />
            </button>
          </div>
        </div>

        {/* Padding */}
        <div style={ds.controlWrapper}>
          <label style={ds.label}>Padding</label>
          <div
            style={{
              ...ds.group,
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "2px 2px 2px 8px",
            }}
          >
            <BsArrowsAngleExpand size={18} title="Padding" />
            <input
              type="number"
              style={{ ...ds.inputNumber, border: "none", width: "45px" }}
              value={selectedLayer.padding}
              onChange={(e) => handleNumberChange("padding", e.target.value)}
              title="Padding"
            />
          </div>
        </div>

        {/* Shadow */}
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

  return <div style={ds.bar}>Select a layer to see properties.</div>;
};
