import lz from "lz-string";
import { create } from "zustand";
import { createJSONStorage, devtools, persist, StateStorage } from "zustand/middleware";
import { DEFAULT_IMPLEMENTATION, DEFAULT_SETUP_CODE, DEFAULT_SETUP_DTS, README_CONTENT } from "@/constants";

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lz;

const hybridStorage: StateStorage = {
  getItem: (key): string | null => {
    if (typeof window === "undefined") return null;

    try {
      if (location.hash.length > 2) {
        const encoded = location.hash.slice(2);
        const decompressed = decompressFromEncodedURIComponent(encoded);
        if (!decompressed) return null;

        localStorage.setItem(key, decompressed);
        return decompressed;
      }

      const stored = localStorage.getItem(key);
      if (!stored) return null;
      JSON.parse(stored);
      return stored;
    } catch (error) {
      console.error("Error reading store:", error);
      return null;
    }
  },
  setItem: (key, newValue): void => {
    if (typeof window === "undefined") return;

    const parsed = JSON.parse(newValue);
    const compressed = compressToEncodedURIComponent(newValue);
    location.hash = `#/${compressed}`;
    localStorage.setItem(key, JSON.stringify(parsed));
  },
  removeItem: (key): void => {
    if (typeof window === "undefined") return;

    location.hash = "";
    localStorage.removeItem(key);
  },
};

export interface Implementation {
  id: string;
  filename: string;
  content: string;
}

export interface Library {
  name: string;
}

export interface PersistentState {
  // version
  version: number;

  // implementations
  implementations: Implementation[];
  addImplementation: (implementation: Implementation) => void;
  updateImplementationCode: (id: string, content: string) => void;
  removeImplementation: (id: string) => void;
  renameImplementation: (id: string, filename: string) => void;

  // active tab
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;

  // setup code
  setupCode: string;
  setSetupCode: (code: string) => void;

  // setup dts
  setupDTS: string;
  setSetupDTS: (code: string) => void;

  // readme
  readmeContent: string;
  setReadmeContent: (content: string) => void;

  // libraries
  libraries: Library[];
  addLibrary: (name: string) => void;
  removeLibrary: (name: string) => void;
}

type PersistentStateVersion = PersistentState;

// versioning
const CURRENT_VERSION = 1;
const migratePersistentState = (state: PersistentStateVersion, _prevVersion: number) => {
  return state;
};

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist(
      (set) => ({
        // version
        version: CURRENT_VERSION,

        // implementations
        implementations: [
          {
            id: "example",
            filename: "example.ts",
            content: DEFAULT_IMPLEMENTATION,
          },
        ],
        addImplementation: (implementation) =>
          set((state) => ({
            implementations: [...state.implementations, implementation],
          })),
        updateImplementationCode: (id, content) => {
          set((state) => ({
            implementations: state.implementations.map((item) => {
              if (item.id === id) return { ...item, content };
              return item;
            }),
          }));
        },
        renameImplementation: (id, filename) =>
          set((state) => ({
            implementations: state.implementations.map((i) => (i.id === id ? { ...i, filename } : i)),
          })),
        removeImplementation: (id) =>
          set((state) => ({
            implementations: state.implementations.filter((i) => i.id !== id),
            activeTabId: state.activeTabId === id ? null : state.activeTabId,
          })),

        // active tab
        activeTabId: null,
        setActiveTabId: (id) => set({ activeTabId: id }),

        // setup
        setupCode: DEFAULT_SETUP_CODE,
        setSetupCode: (code) => set({ setupCode: code }),

        // setup dts
        setupDTS: DEFAULT_SETUP_DTS,
        setSetupDTS: (code) => set({ setupDTS: code }),

        // readme
        readmeContent: README_CONTENT,
        setReadmeContent: (content) => set({ readmeContent: content }),

        // libraries
        libraries: [],
        addLibrary: (name: string) => {
          set((state) => ({
            libraries: [...state.libraries, { name }],
          }));
        },
        removeLibrary: (name) => {
          set((state) => ({
            libraries: state.libraries.filter((l) => l.name !== name),
          }));
        },
      }),
      {
        name: "persistent-store",
        storage: createJSONStorage(() => hybridStorage),
        version: CURRENT_VERSION,
        migrate: (prevState, prevVersion) => {
          return migratePersistentState(prevState as PersistentStateVersion, prevVersion);
        },
      },
    ),
  ),
);
