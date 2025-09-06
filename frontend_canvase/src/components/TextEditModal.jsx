import React, { useState, useRef, useEffect } from "react";

export const TextEditModal = ({ editingLayer, onCommit, onExit }) => {
  const [text, setText] = useState(editingLayer.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleCommit = () => {
    onCommit(text);
    onExit();
  };

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Text Layer</h3>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onExit}>Cancel</button>
          <button className="ok-button" onClick={handleCommit}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
