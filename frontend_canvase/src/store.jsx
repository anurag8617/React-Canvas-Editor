import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const TOOLS = {
  MOVE: "move",
  TEXT: "text",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  CURVE_TEXT: "curvetext",
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
  isCurved: false,
  curveRadius: 200,
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
  fillType: "color", // NEW: Can be 'color' or 'image'
  fillColor: "#cccccc", // UNCHANGED: For the color picker
  fillImageSrc: null, // NEW: Will hold the image URL
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
  fillType: "color", // "color" or "image"
  fillColor: "#cccccc",
  fillImageSrc: null, // URL for the image fill
  strokeColor: "#000000",
  strokeWidth: 0,
});

const createDefaultCurveTextLayer = (x, y) => ({
  id: uuidv4(),
  type: "curvetext",
  name: `Curve Text Layer`,
  x,
  y,
  rotation: 0,
  content: "Curved Text",
  color: "#000000",
  fontFamily: "Arial",
  fontSize: 50,
  fontWeight: "normal",
  curveRadius: 150, // Positive for text on top, negative for text below
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
  updatePageBackgroundColor: (newColor) => {
    set((state) => ({
      pages: state.pages.map((page, index) => {
        if (index !== state.activePageIndex) {
          return page; // Return unchanged page
        }
        // Return a new object for the active page with the updated color
        return { ...page, backgroundColor: newColor };
      }),
    }));
  },
  deletePage: (indexToDelete) => {
    set((state) => {
      // Prevent deleting the last page
      if (state.pages.length <= 1) {
        return state;
      }

      // Create a new array without the deleted page
      const newPages = state.pages.filter((_, i) => i !== indexToDelete);

      let newActiveIndex = state.activePageIndex;

      // Logic to adjust the active page index after deletion
      if (indexToDelete < newActiveIndex) {
        // If we deleted a page before the active one, shift the index left
        newActiveIndex--;
      } else if (
        indexToDelete === newActiveIndex &&
        newActiveIndex >= newPages.length
      ) {
        // If we deleted the active page and it was the last one, move to the new last page
        newActiveIndex = newPages.length - 1;
      }

      return {
        pages: newPages,
        activePageIndex: newActiveIndex,
        selectedLayerId: null, // Deselect layer when changing pages
      };
    });
  },
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

  addCurveTextLayer: (x, y) => {
    const newLayer = createDefaultCurveTextLayer(x, y);
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
