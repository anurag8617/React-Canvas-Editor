// import React from "react";
// import { useEditorStore } from "../store";

// const TextOptions = () => {
//   const updateSelectedLayer = useEditorStore(
//     (state) => state.updateSelectedLayer
//   );
//   const selectedLayer = useEditorStore((state) =>
//     state.layers.find((l) => l.id === state.selectedLayerId)
//   );

//   if (!selectedLayer || selectedLayer.type !== "text") {
//     return <div>Select a text layer to see properties.</div>;
//   }

//   const handleNumberChange = (prop, val) =>
//     updateSelectedLayer(prop, Number(val) || 0);

//   return (
//     <>
//       {/* Font Family */}
//       <select
//         value={selectedLayer.fontFamily}
//         onChange={(e) => updateSelectedLayer("fontFamily", e.target.value)}
//         title="Font Family"
//       >
//         <option>Arial</option>
//         <option>Verdana</option>
//         <option>Georgia</option>
//         <option>Times New Roman</option>
//         <option>Courier New</option>
//         <option>Impact</option>
//       </select>

//       {/* Font Size & Color */}
//       <input
//         type="number"
//         style={{ width: "60px" }}
//         value={selectedLayer.fontSize}
//         onChange={(e) => handleNumberChange("fontSize", e.target.value)}
//         title="Font Size"
//       />
//       <input
//         type="color"
//         value={selectedLayer.color}
//         onChange={(e) => updateSelectedLayer("color", e.target.value)}
//         title="Text Color"
//       />

//       {/* Text Align */}
//       <div className="control-group" title="Text Align">
//         <button
//           onClick={() => updateSelectedLayer("textAlign", "left")}
//           style={{
//             fontWeight: selectedLayer.textAlign === "left" ? "bold" : "normal",
//           }}
//         >
//           L
//         </button>
//         <button
//           onClick={() => updateSelectedLayer("textAlign", "center")}
//           style={{
//             fontWeight:
//               selectedLayer.textAlign === "center" ? "bold" : "normal",
//           }}
//         >
//           C
//         </button>
//         <button
//           onClick={() => updateSelectedLayer("textAlign", "right")}
//           style={{
//             fontWeight: selectedLayer.textAlign === "right" ? "bold" : "normal",
//           }}
//         >
//           R
//         </button>
//       </div>

//       {/* Text Case */}
//       <div className="control-group" title="Text Case">
//         <button
//           onClick={() => updateSelectedLayer("textCase", "normal")}
//           style={{
//             fontWeight: selectedLayer.textCase === "normal" ? "bold" : "normal",
//           }}
//         >
//           Aa
//         </button>
//         <button
//           onClick={() => updateSelectedLayer("textCase", "uppercase")}
//           style={{
//             fontWeight:
//               selectedLayer.textCase === "uppercase" ? "bold" : "normal",
//           }}
//         >
//           AA
//         </button>
//         <button
//           onClick={() => updateSelectedLayer("textCase", "lowercase")}
//           style={{
//             fontWeight:
//               selectedLayer.textCase === "lowercase" ? "bold" : "normal",
//           }}
//         >
//           aa
//         </button>
//       </div>

//       {/* Background & Padding */}
//       <input
//         type="color"
//         value={selectedLayer.backgroundColor}
//         onChange={(e) => updateSelectedLayer("backgroundColor", e.target.value)}
//         title="Background Color"
//       />
//       <input
//         type="number"
//         style={{ width: "60px" }}
//         value={selectedLayer.padding}
//         onChange={(e) => handleNumberChange("padding", e.target.value)}
//         title="Padding"
//       />

//       {/* Text Shadow */}
//       <fieldset
//         className="control-group"
//         style={{ padding: "2px 5px", border: "1px solid #555" }}
//       >
//         <legend style={{ fontSize: "10px" }}>Shadow</legend>
//         <input
//           type="checkbox"
//           id="shadowCheck"
//           checked={selectedLayer.hasShadow}
//           onChange={(e) => updateSelectedLayer("hasShadow", e.target.checked)}
//         />
//         <input
//           type="color"
//           disabled={!selectedLayer.hasShadow}
//           value={selectedLayer.shadowColor}
//           onChange={(e) => updateSelectedLayer("shadowColor", e.target.value)}
//           title="Shadow Color"
//         />
//         <input
//           type="range"
//           disabled={!selectedLayer.hasShadow}
//           style={{ width: "50px" }}
//           min="0"
//           max="40"
//           value={selectedLayer.shadowBlur}
//           onChange={(e) => handleNumberChange("shadowBlur", e.target.value)}
//           title="Shadow Blur"
//         />
//         <input
//           type="number"
//           disabled={!selectedLayer.hasShadow}
//           style={{ width: "40px" }}
//           value={selectedLayer.shadowOffsetX}
//           onChange={(e) => handleNumberChange("shadowOffsetX", e.target.value)}
//           title="Shadow X"
//         />
//         <input
//           type="number"
//           disabled={!selectedLayer.hasShadow}
//           style={{ width: "40px" }}
//           value={selectedLayer.shadowOffsetY}
//           onChange={(e) => handleNumberChange("shadowOffsetY", e.target.value)}
//           title="Shadow Y"
//         />
//       </fieldset>
//     </>
//   );
// };

// export const OptionsBar = () => {
//   const selectedLayer = useEditorStore((state) =>
//     state.layers.find((l) => l.id === state.selectedLayerId)
//   );

//   return (
//     <div className="options-bar">
//       {selectedLayer?.type === "text" ? (
//         <TextOptions />
//       ) : (
//         <div>Select a text layer to see properties.</div>
//       )}
//     </div>
//   );
// };

import React from "react";
import { useEditorStore } from "../store";

export const OptionsBar = () => {
  const updateSelectedLayer = useEditorStore(
    (state) => state.updateSelectedLayer
  );
  const selectedLayer = useEditorStore((state) =>
    state.layers.find((l) => l.id === state.selectedLayerId)
  );

  if (!selectedLayer || selectedLayer.type !== "text") {
    return (
      <div className="options-bar">Select a text layer to see properties.</div>
    );
  }

  const handleNumberChange = (prop, val) =>
    updateSelectedLayer(prop, Number(val) || 0);
  const toggleBold = () =>
    updateSelectedLayer(
      "fontWeight",
      selectedLayer.fontWeight === "bold" ? "normal" : "bold"
    );
  const toggleUnderline = () =>
    updateSelectedLayer("underline", !selectedLayer.underline);

  return (
    <div className="options-bar">
      {/* Font Family */}
      <select
        value={selectedLayer.fontFamily}
        onChange={(e) => updateSelectedLayer("fontFamily", e.target.value)}
        title="Font Family"
      >
        <option>Arial</option>
        <option>Verdana</option>
        <option>Georgia</option>
        <option>Times New Roman</option>
        <option>Courier New</option>
        <option>Impact</option>
      </select>

      {/* Font Size */}
      <input
        type="number"
        style={{ width: "60px" }}
        value={selectedLayer.fontSize}
        onChange={(e) => handleNumberChange("fontSize", e.target.value)}
        title="Font Size"
      />

      {/* NEW Bold and Underline Buttons */}
      <div className="control-group" title="Font Style">
        <button
          onClick={toggleBold}
          style={{
            fontWeight: selectedLayer.fontWeight === "bold" ? "bold" : "normal",
          }}
        >
          B
        </button>
        <button
          onClick={toggleUnderline}
          style={{
            textDecoration: selectedLayer.underline ? "underline" : "none",
          }}
        >
          U
        </button>
      </div>

      {/* Color */}
      <input
        type="color"
        value={selectedLayer.color}
        onChange={(e) => updateSelectedLayer("color", e.target.value)}
        title="Text Color"
      />

      {/* Text Align */}
      <div className="control-group" title="Text Align">
        <button
          onClick={() => updateSelectedLayer("textAlign", "left")}
          style={{
            fontWeight: selectedLayer.textAlign === "left" ? "bold" : "normal",
          }}
        >
          L
        </button>
        <button
          onClick={() => updateSelectedLayer("textAlign", "center")}
          style={{
            fontWeight:
              selectedLayer.textAlign === "center" ? "bold" : "normal",
          }}
        >
          C
        </button>
        <button
          onClick={() => updateSelectedLayer("textAlign", "right")}
          style={{
            fontWeight: selectedLayer.textAlign === "right" ? "bold" : "normal",
          }}
        >
          R
        </button>
      </div>

      {/* Text Case */}
      <div className="control-group" title="Text Case">
        <button
          onClick={() => updateSelectedLayer("textCase", "uppercase")}
          style={{
            fontWeight:
              selectedLayer.textCase === "uppercase" ? "bold" : "normal",
          }}
        >
          AA
        </button>
        <button
          onClick={() => updateSelectedLayer("textCase", "lowercase")}
          style={{
            fontWeight:
              selectedLayer.textCase === "lowercase" ? "bold" : "normal",
          }}
        >
          aa
        </button>
      </div>

      {/* Background & Padding */}
      <input
        type="color"
        value={selectedLayer.backgroundColor}
        onChange={(e) => updateSelectedLayer("backgroundColor", e.target.value)}
        title="Background Color"
      />
      <input
        type="number"
        style={{ width: "60px" }}
        value={selectedLayer.padding}
        onChange={(e) => handleNumberChange("padding", e.target.value)}
        title="Padding"
      />

      {/* Text Shadow */}
      <fieldset
        className="control-group"
        style={{ padding: "2px 5px", border: "1px solid #555" }}
      >
        <legend style={{ fontSize: "10px" }}>Shadow</legend>
        <input
          type="checkbox"
          id="shadowCheck"
          checked={selectedLayer.hasShadow}
          onChange={(e) => updateSelectedLayer("hasShadow", e.target.checked)}
        />
        <input
          type="color"
          disabled={!selectedLayer.hasShadow}
          value={selectedLayer.shadowColor}
          onChange={(e) => updateSelectedLayer("shadowColor", e.target.value)}
          title="Shadow Color"
        />
        <input
          type="range"
          disabled={!selectedLayer.hasShadow}
          style={{ width: "50px" }}
          min="0"
          max="40"
          value={selectedLayer.shadowBlur}
          onChange={(e) => handleNumberChange("shadowBlur", e.target.value)}
          title="Shadow Blur"
        />
      </fieldset>
    </div>
  );
};
