// import { create } from "zustand";
// import { v4 as uuidv4 } from "uuid";

// export const TOOLS = {
//   MOVE: "move",
//   TEXT: "text",
// };

// const createDefaultTextLayer = (x, y) => ({
//   id: uuidv4(),
//   type: "text",
//   name: `Text Layer`,
//   x,
//   y,
//   rotation: 0,
//   content: "",
//   color: "#ffffff",
//   fontFamily: "Arial",
//   fontSize: 50,
//   backgroundColor: "#00000000",
//   padding: 10,
//   textAlign: "center",
//   textCase: "normal",
//   hasShadow: false,
//   shadowBlur: 10,
//   shadowColor: "#000000",
//   shadowOffsetX: 5,
//   shadowOffsetY: 5,
//   // NEW properties for Bold and Underline
//   fontWeight: "normal", // 'normal' or 'bold'
//   underline: false, // true or false
// });

// export const useEditorStore = create((set) => ({
//   layers: [],
//   selectedLayerId: null,
//   activeTool: TOOLS.MOVE,
//   interactionState: { mode: "idle" },

//   setActiveTool: (tool) => set({ activeTool: tool }),
//   addTextLayer: (x, y) => {
//     const newLayer = createDefaultTextLayer(x, y);
//     set((state) => ({
//       layers: [...state.layers, newLayer],
//       selectedLayerId: newLayer.id,
//       activeTool: TOOLS.MOVE,
//     }));
//     return newLayer;
//   },
//   setSelectedLayerId: (id) => set({ selectedLayerId: id }),
//   updateSelectedLayer: (property, value) =>
//     set((state) => ({
//       layers: state.layers.map((layer) =>
//         layer.id === state.selectedLayerId
//           ? { ...layer, [property]: value }
//           : layer
//       ),
//     })),
//   deleteLayer: (id) =>
//     set((state) => ({
//       layers: state.layers.filter((layer) => layer.id !== id),
//       selectedLayerId:
//         state.selectedLayerId === id ? null : state.selectedLayerId,
//     })),
//   reorderLayers: (draggedId, targetId) =>
//     set((state) => {
//       const layers = [...state.layers];
//       const draggedIndex = layers.findIndex((l) => l.id === draggedId);
//       let targetIndex = layers.findIndex((l) => l.id === targetId);
//       if (draggedIndex === -1 || targetIndex === -1) return state;
//       const [draggedItem] = layers.splice(draggedIndex, 1);
//       layers.splice(targetIndex, 0, draggedItem);
//       return { layers };
//     }),
//   startTransform: (mode, startPoint, originalLayer) =>
//     set({
//       interactionState: { mode, startPoint, originalLayer },
//     }),
//   stopTransform: () =>
//     set({
//       interactionState: { mode: "idle" },
//     }),
// }));

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const TOOLS = {
  MOVE: "move",
  TEXT: "text",
};

const createDefaultTextLayer = (x, y) => ({
  id: uuidv4(),
  type: "text",
  name: `Text Layer`,
  x,
  y,
  rotation: 0,
  content: "This is a new text layer",
  color: "#000000",
  fontFamily: "Arial",
  fontSize: 50,
  width: 400, // For resizable text box
  height: 200, // Add a default height for the text box
  padding: 10,
  textAlign: "center",
  textCase: "normal",
  hasShadow: false,
  shadowBlur: 10,
  shadowColor: "#000000",
  shadowOffsetX: 5,
  shadowOffsetY: 5,
  fontWeight: "normal",
  underline: false,
});

const createDefaultPage = () => ({
  id: uuidv4(),
  backgroundColor: "#ffffff",
  layers: [],
});

export const useEditorStore = create((set) => ({
  pages: [createDefaultPage()],
  activePageIndex: 0,
  selectedLayerId: null,
  activeTool: TOOLS.MOVE,
  interactionState: { mode: "idle" },

  // --- PAGE ACTIONS ---
  addPage: () =>
    set((state) => ({
      pages: [...state.pages, createDefaultPage()],
      activePageIndex: state.pages.length,
    })),
  setActivePageIndex: (index) =>
    set({ activePageIndex: index, selectedLayerId: null }),
  updateActivePage: (property, value) =>
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex ? { ...page, [property]: value } : page
      ),
    })),

  // --- TOOL ACTIONS ---
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  // --- LAYER ACTIONS ---
  addTextLayer: (x, y) => {
    const newLayer = createDefaultTextLayer(x, y);
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex
          ? { ...page, layers: [...page.layers, newLayer] }
          : page
      ),
      selectedLayerId: newLayer.id,
      activeTool: TOOLS.MOVE,
    }));
    return newLayer;
  },

  updateSelectedLayer: (property, value) =>
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex
          ? {
              ...page,
              layers: page.layers.map((layer) =>
                layer.id === state.selectedLayerId
                  ? { ...layer, [property]: value }
                  : layer
              ),
            }
          : page
      ),
    })),

  deleteLayer: (id) =>
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex
          ? { ...page, layers: page.layers.filter((l) => l.id !== id) }
          : page
      ),
      selectedLayerId:
        state.selectedLayerId === id ? null : state.selectedLayerId,
    })),

  reorderLayers: (draggedId, targetId) =>
    set((state) => {
      const activePage = state.pages[state.activePageIndex];
      const layers = [...activePage.layers];
      const draggedIndex = layers.findIndex((l) => l.id === draggedId);
      const targetIndex = layers.findIndex((l) => l.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return state;
      const [draggedItem] = layers.splice(draggedIndex, 1);
      layers.splice(targetIndex, 0, draggedItem);
      return {
        pages: state.pages.map((page, index) =>
          index === state.activePageIndex ? { ...page, layers } : page
        ),
      };
    }),

  // --- TRANSFORM ACTIONS ---
  startTransform: (mode) => set({ interactionState: { mode } }),
  stopTransform: () => set({ interactionState: { mode: "idle" } }),
}));
