import { useCallback, useRef } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Editor, { loader, Monaco as MonacoEditor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { cn } from "@/lib/utils";
import { MonacoTab } from "@/components/common/MonacoTab";

const zodFiles = import.meta.glob("../../../../node_modules/zod/**/*.d.ts", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const transformToGlobalDeclarations = (dts: string) => {
  return `declare global {
${dts
  .replace(/export declare/g, "declare")
  .replace(/export interface/g, "interface")
  .replace(/export type/g, "type")
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}
}

export {};`;
};

export interface MonacoProps {
  height?: string;
  defaultValue?: string;
  value?: string;
  language?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
  tabs?: MonacoTab[];
  extraLibs?: { content: string; filename?: string }[];
  onChange?: (value: string | undefined) => void;
  onDTSChange?: (value: string) => void;
  onChangeTab?: (tab: MonacoTab) => void;
  onCloseTab?: (tab: MonacoTab) => void;
  onSetTabs?: (tabs: MonacoTab[]) => void;
}

export const Monaco = ({
  className,
  tabs,
  extraLibs,
  onChangeTab,
  onCloseTab,
  onSetTabs,
  onDTSChange,
  ...props
}: MonacoProps) => {
  const activeFile = tabs?.find((f) => f.active);

  const onDTSChangeRef = useRef<((value: string) => void) | null>(null);
  onDTSChangeRef.current = onDTSChange ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!tabs) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tabs.findIndex((item) => item.name === active.id);
    const newIndex = tabs.findIndex((item) => item.name === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = [...tabs];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);
      onSetTabs?.(newOrder);
    }
  };

  const handleBeforeMount = (monaco: MonacoEditor) => {
    loader.config({
      paths: {
        vs: `${location.origin}/monaco-editor/min/vs`,
      },
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      declaration: true,
    });

    for (const file of Object.keys(zodFiles)) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.endsWith("index.d.ts") ? zodFiles[file] : `declare module 'zod' { ${zodFiles[file]} }`,
        "file:///node_modules/zod/",
      );
    }

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'zod' {
        import * as z from 'zod';
        export { z }
      }
      `,
      "zod",
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      import * as zz from 'zod';
      declare global {
        var z: typeof zz;
      }
      declare const x: number;
      `,
    );

    // custom libs
    for (const lib of extraLibs ?? []) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(lib.content, lib.filename);
    }
  };

  const handleMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: MonacoEditor) => {
    editor.onDidChangeModelContent(async () => {
      const value = editor.getValue();
      props.onChange?.(value);

      if (onDTSChangeRef.current) {
        (async () => {
          const model = editor.getModel();
          if (!model) return;
          const tsWorker = await monaco.languages.typescript.getTypeScriptWorker();
          const worker = await tsWorker(model.uri);
          const outputs = await worker.getEmitOutput(model.uri.toString());
          const dts = outputs.outputFiles.find((file) => file.name.endsWith(".d.ts"))?.text;
          onDTSChangeRef.current?.(dts ? transformToGlobalDeclarations(dts) : "");
        })();
      }
    });

    monaco.editor.defineTheme("custom", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {},
    });
    editor.updateOptions({
      theme: "custom",
      automaticLayout: true,
      fixedOverflowWidgets: true,
      glyphMargin: false,
      folding: false,
      padding: {
        top: 8,
        bottom: 8,
      },
      lineNumbers: "off",
      minimap: {
        enabled: false,
      },
      insertSpaces: true,
      tabSize: 2,
      scrollBeyondLastLine: false,
      ...props.options,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* tabs */}
      {tabs && tabs.length > 0 && (
        <DndContext modifiers={[restrictToHorizontalAxis]} sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex border-b bg-zinc-50">
            <SortableContext items={tabs.map((f) => f.name)} strategy={horizontalListSortingStrategy}>
              <div className="flex overflow-x-auto overflow-y-hidden custom-scrollbar">
                {tabs.map((file) => (
                  <MonacoTab key={file.id} tab={file} onClick={onChangeTab} onClose={onCloseTab} />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>
      )}

      {/* editor */}
      <div className="h-full">
        <Editor
          {...props}
          key={activeFile?.name}
          beforeMount={handleBeforeMount}
          className={cn("nodrag h-full", className)}
          theme="custom"
          onMount={handleMount}
        />
      </div>
    </div>
  );
};
