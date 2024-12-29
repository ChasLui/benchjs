import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePersistentStore } from "@/stores/persistentStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsView() {
  const store = usePersistentStore();
  const [libraryName, setLibraryName] = useState("");
  const [libraryUrl, setLibraryUrl] = useState("");

  const handleAddLibrary = () => {
    if (!libraryName.trim() || !libraryUrl.trim()) return;
    store.addLibrary(libraryName.trim(), libraryUrl.trim());
    setLibraryName("");
    setLibraryUrl("");
  };

  const handleRemoveLibrary = (name: string) => {
    store.removeLibrary(name);
  };

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <AnimatePresence>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Libraries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* add library */}
                <div className="flex gap-2">
                  <Input
                    className="flex-1 px-2 text-sm rounded border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="lodash"
                    value={libraryName}
                    onChange={(e) => setLibraryName(e.target.value)}
                  />
                  <Input
                    className="flex-1 px-2 text-sm rounded border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="https://esm.sh/lodash-es"
                    value={libraryUrl}
                    onChange={(e) => setLibraryUrl(e.target.value)}
                  />
                  <Button onClick={handleAddLibrary}>Add</Button>
                </div>

                {/* list */}
                <div className="space-y-2">
                  {store.libraries.map((lib) => (
                    <div
                      key={lib.name}
                      className="flex justify-between items-center p-2 rounded bg-zinc-100 dark:bg-zinc-900"
                    >
                      <div>
                        <span className="text-sm font-medium">{lib.name}</span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400"> — {lib.url}</span>
                      </div>
                      <Button variant="destructive" onClick={() => handleRemoveLibrary(lib.name)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

