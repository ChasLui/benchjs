import { openDB } from "idb";

const DB_NAME = "dependencies-cache";
const STORE_NAME = "files";
const VERSION = 1;

const getDB = () => {
  if (typeof window === "undefined") return null;
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
};

export const cache = {
  async get(key: string) {
    const db = await getDB();
    return db?.get(STORE_NAME, key);
  },
  async set(key: string, value: string) {
    const db = await getDB();
    return db?.put(STORE_NAME, value, key);
  },
  async clear() {
    const db = await getDB();
    return db?.clear(STORE_NAME);
  },
  async count() {
    const db = await getDB();
    return db?.count(STORE_NAME) ?? 0;
  },
};
