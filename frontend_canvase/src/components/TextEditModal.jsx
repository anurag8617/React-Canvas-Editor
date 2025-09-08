import React, { useState, useRef, useEffect } from "react";

// Helper component to inject CSS into the document head for the modal
const TextEditModalStyles = () => (
  <style>{`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7); /* Dark semi-transparent background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000; /* Ensure it's above everything else */
    }

    .modal-window {
      background-color: #383838; /* Dark background from your global CSS */
      color: #e0e0e0; /* Light text color */
      padding: 25px;
      border-radius: 24px;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      min-width: 400px; /* Minimum width */
      max-width: 80vw; /* Maximum width */
      max-height: 80vh; /* Maximum height */
    }

    .modal-window h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #b53b74; /* A highlight color */
      text-align: center;
      font-size: 1.4em;
    }

    .modal-window textarea {
      width: 100%;
      flex-grow: 1; /* Allow textarea to fill available space */
      min-height: 200px; /* Make it significantly big */
      padding: 12px;
      margin-bottom: 20px;
      border: 1px solid #555; /* Darker border */
      border-radius: 6px;
      background-color: #1e1e1e; /* Even darker background for the input area */
      color: #e0e0e0;
      font-family: inherit;
      font-size: 1em;
      resize: vertical; /* Allow vertical resizing only */
      box-sizing: border-box; /* Include padding/border in width/height */
    }

    .modal-buttons {
      display: flex;
      justify-content: flex-end; /* Align buttons to the right */
      gap: 10px;
    }

    .modal-buttons button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.2s ease;
    }

    .modal-buttons button:hover {
      opacity: 0.9;
    }

    .modal-buttons .ok-button {
      background-color: #b53b74; 
      color: white;
      border-radius: 50px;
    }
    .modal-buttons .cancel-button{
      color: #e0e0e0;
      border-radius: 50px;
    }

    .modal-buttons .ok-button:hover {
      background-color: #b31b62ff;
    }

    .modal-buttons button:not(.ok-button) {
      background-color: #555; /* Neutral button color */
      color: #e0e0e0;
    }

    .modal-buttons button:not(.ok-button):hover {
      background-color: #666;
    }
  `}</style>
);

export const TextEditModal = ({ editingLayer, onCommit, onExit }) => {
  const [text, setText] = useState(editingLayer.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
    // Optional: Select all text when modal opens
    textareaRef.current.select();
  }, []);

  const handleCommit = () => {
    onCommit(text);
    onExit();
  };

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <TextEditModalStyles /> {/* Inject styles */}
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Text Layer</h3>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          // Added onKeyDown for Enter/Escape functionality, common in modals
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              // Commit on Enter, new line on Shift+Enter
              e.preventDefault();
              handleCommit();
            } else if (e.key === "Escape") {
              // Exit on Escape
              onExit();
            }
          }}
        />
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onExit}>
            Cancel
          </button>
          <button className="ok-button" onClick={handleCommit}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
