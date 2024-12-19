import { create } from "zustand";
import {
  DEFAULT_IMPLEMENTATION,
  DEFAULT_SETUP_CODE,
  README_CONTENT,
} from "@/constants";

interface BenchmarkStore {
  // implementations
  implementations: { filename: string; content: string }[];
  updateImplementation: (filename: string, content: string) => void;
  removeImplementation: (filename: string) => void;
  renameImplementation: (oldName: string, newName: string) => void;

  // setup code
  setupCode: string;
  setSetupCode: (code: string) => void;

  // readme
  readmeContent: string;
  setReadmeContent: (content: string) => void;

  // libraries
  libraries: { name: string; url: string }[];
  addLibrary: (name: string, url: string) => void;
  removeLibrary: (name: string) => void;
}

export const useBenchmarkStore = create<BenchmarkStore>((set, get) => ({
  // implementations
  implementations: [
    { filename: "example.ts", content: DEFAULT_IMPLEMENTATION },
  ],
  updateImplementation: (filename, content) => {
    const hasFilename = get().implementations.some(
      (i) => i.filename === filename,
    );
    if (hasFilename) {
      set((state) => ({
        implementations: state.implementations.map((item) => {
          if (item.filename === filename) return { ...item, content };
          return item;
        }),
      }));
      return;
    }
    set({ implementations: [...get().implementations, { filename, content }] });
  },
  renameImplementation: (oldName, newName) =>
    set((state) => {
      return {
        implementations: state.implementations.map((item) => {
          if (item.filename === oldName) return { ...item, filename: newName };
          return item;
        }),
      };
    }),
  removeImplementation: (filename) => {
    set((state) => ({
      implementations: state.implementations.filter(
        (i) => i.filename !== filename,
      ),
    }));
  },

  // setup
  setupCode: DEFAULT_SETUP_CODE,
  setSetupCode: (code) => set({ setupCode: code }),

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
}));
