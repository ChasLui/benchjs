import lz from "lz-string";
import { create } from "zustand";
import { createJSONStorage, devtools, persist, StateStorage } from "zustand/middleware";
import { DEFAULT_IMPLEMENTATION, DEFAULT_SETUP_CODE, DEFAULT_SETUP_DTS, README_CONTENT } from "@/constants";

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lz;

const hashStorage: StateStorage = {
  getItem: (_key): string => {
    const encoded = location.hash.slice(2);
    const decompressed = decompressFromEncodedURIComponent(encoded);
    return JSON.parse(decompressed);
  },
  setItem: (_key, newValue): void => {
    const compressed = compressToEncodedURIComponent(JSON.stringify(newValue));
    location.hash = `#/${compressed}`;
  },
  removeItem: (_key): void => {
    location.hash = "";
  },
};

export interface Implementation {
  id: string;
  filename: string;
  content: string;
}

export interface PersistentState {
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
  libraries: { name: string; url: string }[];
  addLibrary: (name: string, url: string) => void;
  removeLibrary: (name: string) => void;
}

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist(
      (set) => ({
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
        addLibrary: (name, url) => {
          set((state) => ({
            libraries: [...state.libraries, { name, url }],
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
        storage: createJSONStorage(() => hashStorage),
      },
    ),
  ),
);
