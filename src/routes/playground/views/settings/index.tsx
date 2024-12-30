import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useDependenciesStore } from "@/stores/dependenciesStore";
import { usePersistentStore } from "@/stores/persistentStore";
import { cache } from "@/services/dependencies/cache";
import { DependencyService } from "@/services/dependencies/DependencyService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SettingsViewProps {
  dependencyService: DependencyService;
}

export function SettingsView({ dependencyService }: SettingsViewProps) {
  const store = usePersistentStore();
  const dependencies = useDependenciesStore();
  const [libraryName, setLibraryName] = useState("");
  const [cacheCount, setCacheCount] = useState(0);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const getStatusBadge = (status: "error" | "loading" | "success") => {
    if (status === "error") return <Badge variant="destructive">{status}</Badge>;
    if (status === "loading") return <Badge variant="outline">{status}</Badge>;
    return <Badge variant="success">{status}</Badge>;
  };

  const handleAddLibrary = async () => {
    if (!libraryName.trim()) return;
    if (store.libraries.some((lib) => lib.name === libraryName.trim())) return;
    setLibraryName("");
    store.addLibrary(libraryName.trim());
    await dependencyService.addLibrary({ name: libraryName.trim() });
    setCacheCount(await cache.count());
  };

  const handleRemoveLibrary = (name: string) => {
    store.removeLibrary(name);
  };

  const handleClearCache = async () => {
    await cache.clear();
    setCacheCount(0);
  };

  const handleStartEdit = (name: string) => {
    setEditingName(name);
    setEditValue(name);
  };

  const handleCancelEdit = () => {
    setEditingName(null);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editingName || !editValue.trim()) return;
    const oldName = editingName;
    const newName = editValue.trim();

    if (oldName === newName) {
      setEditingName(null);
      return;
    }
    if (store.libraries.some((lib) => lib.name === newName)) return;

    store.removeLibrary(oldName);
    store.addLibrary(newName);
    await dependencyService.addLibrary({ name: newName });

    setEditingName(null);
    setEditValue("");
    setCacheCount(await cache.count());
  };

  // update cache size
  useEffect(() => {
    cache.count().then(setCacheCount);
  }, []);

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
                <Button variant="outline" onClick={handleClearCache}>
                  Clear Cache {cacheCount > 0 && `(${cacheCount})`}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* add library */}
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="lodash"
                    value={libraryName}
                    onChange={(e) => setLibraryName(e.target.value)}
                  />
                  <Button onClick={handleAddLibrary}>Add</Button>
                </div>

                {/* list */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {store.libraries.map((lib) => {
                      const dependency = dependencies.dependencyMap[lib.name];
                      const isEditing = editingName === lib.name;

                      return (
                        <TableRow key={lib.name}>
                          <TableCell className="font-medium">
                            {isEditing ?
                              <Input
                                className="h-8"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                            : lib.name}
                          </TableCell>
                          <TableCell>{dependency?.package?.version || "-"}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {dependency?.package?.description || "-"}
                          </TableCell>
                          <TableCell>
                            {dependency ?
                              <>
                                {getStatusBadge(dependency.status)}
                                {dependency.error && (
                                  <span className="ml-2 text-sm text-red-600 dark:text-red-400">
                                    {dependency.error}
                                  </span>
                                )}
                              </>
                            : getStatusBadge("loading")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {isEditing ?
                                <>
                                  <Button size="icon" variant="ghost" onClick={handleSave}>
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              : <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleStartEdit(lib.name)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveLibrary(lib.name)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
