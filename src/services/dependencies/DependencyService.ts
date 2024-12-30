import { Monaco as MonacoEditor } from "@monaco-editor/react";
import { editor as RawMonacoEditor } from "monaco-editor";
import { Dependency, useDependenciesStore } from "@/stores/dependenciesStore";
import { Library } from "@/stores/persistentStore";
import { createATA } from "@/services/dependencies/ata";
import { cachedFetch } from "@/services/dependencies/cachedFetch";

class DependencyService {
  ata: (source: string) => Promise<void>;
  typeFiles = new Map<string, string>();
  monaco: MonacoEditor | null = null;

  constructor() {
    this.ata = createATA({
      fetcher: cachedFetch,
      handlers: {
        receivedFile: (content: string, path: string) => {
          this.addExtraLib(content, path);
        },
        // started: () => {
        //   console.log("started");
        // },
        // progress: (downloaded: number, total: number) => {
        //   console.log("progress", downloaded, total);
        // },
        // finished: (files: Map<string, string>) => {
        //   console.log("finished", files);
        // },
        // errorMessage: (userMessage: string, error: Error) => {
        //   console.log("errorMessage", userMessage, error);
        // },
      },
    });
  }

  async acquireTypes(packageName: string) {
    await this.ata(`import "${packageName}"`);
  }

  addExtraLib(content: string, path: string) {
    if (!this.monaco) return;
    const filePath = `file://${path}`;
    this.monaco.languages.typescript.typescriptDefaults.addExtraLib(content, filePath);
  }

  mountEditor(_editor: RawMonacoEditor.IStandaloneCodeEditor, monaco: MonacoEditor) {
    this.monaco = monaco;

    // add acquired types
    for (const [path, content] of this.typeFiles.entries()) {
      this.addExtraLib(content, path);
    }
  }

  async addLibrary(library: Library) {
    if (useDependenciesStore.getState().dependencyMap[library.name]) return;

    const item: Dependency = {
      name: library.name,
      url: `https://esm.sh/${library.name}`,
      status: "loading",
    };
    useDependenciesStore.getState().setDependency(item);

    // fetch package.json
    const response = await cachedFetch(`${item.url}/package.json`);
    if (!response.ok) {
      useDependenciesStore.getState().updateDependency(item.name, {
        status: "error",
        error: `Failed to fetch package.json: ${response.statusText}`,
      });
      return;
    }
    try {
      const packageJson = await response.json();
      item.package = packageJson;
      useDependenciesStore.getState().updateDependency(item.name, {
        status: "success",
        package: packageJson,
      });
    } catch (error) {
      useDependenciesStore.getState().updateDependency(item.name, {
        status: "error",
        error: `Failed to parse package.json: ${error}`,
      });
      return;
    }

    // fetch types
    this.acquireTypes(library.name);

    /// success
    useDependenciesStore.getState().updateDependency(item.name, {
      status: "success",
    });
  }
}

export { DependencyService };
