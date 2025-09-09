  // import { create } from "zustand";
  // import { v4 as uuidv4 } from "uuid";

  // export const TOOLS = {
  //   MOVE: "move",
  //   TEXT: "text",
  //   RECTANGLE: "rectangle",
  //   CIRCLE: "circle",
  // };

  // const createDefaultTextLayer = (x, y) => ({
  //   id: uuidv4(),
  //   type: "text",
  //   name: `Text Layer`,
  //   x,
  //   y,
  //   rotation: 0,
  //   content: "This is a new text layer",
  //   color: "#000000",
  //   fontFamily: "Arial",
  //   fontSize: 50,
  //   width: 400,
  //   height: 200,
  //   padding: 10,
  //   textAlign: "center",
  //   textCase: "normal",
  //   fontWeight: "normal",
  //   underline: false,
  //   hasShadow: false,
  //   shadowBlur: 10,
  //   shadowColor: "#000000",
  //   shadowOffsetX: 5,
  //   shadowOffsetY: 5,
  //   lineHeight: 1.2,
  //   letterSpacing: 0,
  // });

  // const createDefaultRectangleLayer = (x, y) => ({
  //   id: uuidv4(),
  //   type: "rectangle",
  //   name: `Rectangle Layer`,
  //   x,
  //   y,
  //   rotation: 0,
  //   width: 200,
  //   height: 200,
  //   fillColor: "#cccccc",
  //   strokeColor: "#000000",
  //   strokeWidth: 0,
  // });

  // const createDefaultCircleLayer = (x, y) => ({
  //   id: uuidv4(),
  //   type: "circle",
  //   name: `Circle Layer`,
  //   x,
  //   y,
  //   rotation: 0,
  //   radius: 100,
  //   fillColor: "#cccccc",
  //   strokeColor: "#000000",
  //   strokeWidth: 0,
  // });

  // const createDefaultPage = () => ({
  //   id: uuidv4(),
  //   backgroundColor: "#ffffff",
  //   layers: [],
  //   thumbnailUrl: null, // For the page slider preview
  // });

  // export const useEditorStore = create((set, get) => ({
  //   pages: [createDefaultPage()],
  //   activePageIndex: 0,
  //   selectedLayerId: null,
  //   activeTool: TOOLS.MOVE,

  //   // --- PAGE ACTIONS ---
  //   addPage: () =>
  //     set((state) => ({
  //       pages: [...state.pages, createDefaultPage()],
  //       activePageIndex: state.pages.length,
  //       selectedLayerId: null,
  //     })),
  //   setActivePageIndex: (index) =>
  //     set({ activePageIndex: index, selectedLayerId: null }),

  //   updatePageThumbnail: (pageIndex, url) => {
  //     set((state) => ({
  //       pages: state.pages.map((page, index) =>
  //         index === pageIndex ? { ...page, thumbnailUrl: url } : page
  //       ),
  //     }));
  //   },

  //   updateActivePage: (updater) => {
  //     set((state) => {
  //       const newPages = [...state.pages];
  //       const activePage = { ...newPages[state.activePageIndex] };
  //       updater(activePage);
  //       newPages[state.activePageIndex] = activePage;
  //       return { pages: newPages };
  //     });
  //   },

  //   // --- TOOL ACTIONS ---
  //   setActiveTool: (tool) => set({ activeTool: tool, selectedLayerId: null }),
  //   setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  //   // --- LAYER ACTIONS ---
  //   addTextLayer: (x, y) => {
  //     const newLayer = createDefaultTextLayer(x, y);
  //     get().updateActivePage((page) => {
  //       page.layers = [...page.layers, newLayer];
  //     });
  //     return newLayer;
  //   },

  //   addRectangleLayer: (x, y) => {
  //     const newLayer = createDefaultRectangleLayer(x, y);
  //     get().updateActivePage((page) => {
  //       page.layers = [...page.layers, newLayer];
  //     });
  //   },

  //   addCircleLayer: (x, y) => {
  //     const newLayer = createDefaultCircleLayer(x, y);
  //     get().updateActivePage((page) => {
  //       page.layers = [...page.layers, newLayer];
  //     });
  //   },

  //   addImageLayer: (src, width, height) => {
  //     const newLayer = {
  //       id: uuidv4(),
  //       type: "image",
  //       x: 750,
  //       y: 450,
  //       rotation: 0,
  //       src,
  //       width,
  //       height,
  //     };
  //     get().updateActivePage((page) => {
  //       page.layers = [...page.layers, newLayer];
  //     });
  //   },

  //   updateSelectedLayer: (property, value) => {
  //     get().updateActivePage((page) => {
  //       page.layers = page.layers.map((layer) =>
  //         layer.id === get().selectedLayerId
  //           ? { ...layer, [property]: value }
  //           : layer
  //       );
  //     });
  //   },

  //   deleteLayer: (layerId) => {
  //     get().updateActivePage((page) => {
  //       page.layers = page.layers.filter((layer) => layer.id !== layerId);
  //     });
  //     if (get().selectedLayerId === layerId) {
  //       set({ selectedLayerId: null });
  //     }
  //   },

  //   reorderLayers: (draggedId, targetId) => {
  //     get().updateActivePage((page) => {
  //       const layers = page.layers;
  //       const draggedIndex = layers.findIndex((l) => l.id === draggedId);
  //       const targetIndex = layers.findIndex((l) => l.id === targetId);
  //       if (draggedIndex === -1 || targetIndex === -1) return;
  //       const [draggedLayer] = layers.splice(draggedIndex, 1);
  //       layers.splice(targetIndex, 0, draggedLayer);
  //     });
  //   },
  // }));

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const TOOLS = {
  MOVE: "move",
  TEXT: "text",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
};

const createDefaultTextLayer = (x, y) => ({
  id: uuidv4(),
  type: "text",
  name: `Text Layer`,
  x,
  y,
  rotation: 0,
  content: "This is new text",
  color: "#000000",
  fontFamily: "Arial",
  fontSize: 50,
  width: 400,
  height: 200,
  padding: 10,
  textAlign: "center",
  textCase: "normal",
  fontWeight: "normal",
  underline: false,
  hasShadow: false,
  shadowBlur: 10,
  shadowColor: "#000000",
  shadowOffsetX: 5,
  shadowOffsetY: 5,
  lineHeight: 1.2,
  letterSpacing: 0,
});

const createDefaultRectangleLayer = (x, y) => ({
  id: uuidv4(),
  type: "rectangle",
  name: `Rectangle Layer`,
  x,
  y,
  rotation: 0,
  width: 200,
  height: 200,
  fillColor: "#cccccc",
  strokeColor: "#000000",
  strokeWidth: 0,
});

const createDefaultCircleLayer = (x, y) => ({
  id: uuidv4(),
  type: "circle",
  name: `Circle Layer`,
  x,
  y,
  rotation: 0,
  radius: 100,
  fillColor: "#cccccc",
  strokeColor: "#000000",
  strokeWidth: 0,
});

const createDefaultPage = () => ({
  id: uuidv4(),
  backgroundColor: "#ffffff",
  layers: [],
  thumbnailUrl: null,
});

export const useEditorStore = create((set, get) => ({
  pages: [createDefaultPage()],
  activePageIndex: 0,
  selectedLayerId: null,
  activeTool: TOOLS.MOVE,

  // --- PAGE & TOOL ACTIONS (No changes here) ---
  addPage: () =>
    set((state) => ({
      pages: [...state.pages, createDefaultPage()],
      activePageIndex: state.pages.length,
      selectedLayerId: null,
    })),
  setActivePageIndex: (index) =>
    set({ activePageIndex: index, selectedLayerId: null }),
  updatePageThumbnail: (pageIndex, url) => {
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === pageIndex ? { ...page, thumbnailUrl: url } : page
      ),
    }));
  },
  updateActivePage: (updater) => {
    set((state) => {
      const newPages = [...state.pages];
      const activePage = { ...newPages[state.activePageIndex] };
      updater(activePage);
      newPages[state.activePageIndex] = activePage;
      return { pages: newPages };
    });
  },
  setActiveTool: (tool) => set({ activeTool: tool, selectedLayerId: null }),
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
      // ✅ This line automatically switches to the Move tool
      activeTool: TOOLS.MOVE,
    }));
    return newLayer;
  },

  addRectangleLayer: (x, y) => {
    const newLayer = createDefaultRectangleLayer(x, y);
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex
          ? { ...page, layers: [...page.layers, newLayer] }
          : page
      ),
      selectedLayerId: newLayer.id,
      // ✅ This line automatically switches to the Move tool
      activeTool: TOOLS.MOVE,
    }));
    return newLayer;
  },

  addCircleLayer: (x, y) => {
    const newLayer = createDefaultCircleLayer(x, y);
    set((state) => ({
      pages: state.pages.map((page, index) =>
        index === state.activePageIndex
          ? { ...page, layers: [...page.layers, newLayer] }
          : page
      ),
      selectedLayerId: newLayer.id,
      // ✅ This line automatically switches to the Move tool
      activeTool: TOOLS.MOVE,
    }));
    return newLayer;
  },

  // The rest of your actions are correct and do not need changes
  addImageLayer: (src, width, height) => {
    const newLayer = {
      id: uuidv4(),
      type: "image",
      x: 750,
      y: 450,
      rotation: 0,
      src,
      width,
      height,
    };
    get().updateActivePage((page) => {
      page.layers = [...page.layers, newLayer];
    });
  },
  updateSelectedLayer: (property, value) => {
    get().updateActivePage((page) => {
      page.layers = page.layers.map((layer) =>
        layer.id === get().selectedLayerId
          ? { ...layer, [property]: value }
          : layer
      );
    });
  },
  deleteLayer: (layerId) => {
    get().updateActivePage((page) => {
      page.layers = page.layers.filter((layer) => layer.id !== layerId);
    });
    if (get().selectedLayerId === layerId) {
      set({ selectedLayerId: null });
    }
  },
  reorderLayers: (draggedId, targetId) => {
    get().updateActivePage((page) => {
      const layers = page.layers;
      const draggedIndex = layers.findIndex((l) => l.id === draggedId);
      const targetIndex = layers.findIndex((l) => l.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return;
      const [draggedLayer] = layers.splice(draggedIndex, 1);
      layers.splice(targetIndex, 0, draggedLayer);
    });
  },
}));
