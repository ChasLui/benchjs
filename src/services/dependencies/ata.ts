import { ATABootstrapConfig, setupTypeAcquisition } from "@typescript/ata";
import ts from "typescript";

type CreateATAOptions = {
  fetcher: ATABootstrapConfig["fetcher"];
  handlers: Partial<ATABootstrapConfig["delegate"]>;
};

export const createATA = (opts: CreateATAOptions) =>
  setupTypeAcquisition({
    projectName: "BenchJS",
    typescript: ts,
    logger: console,
    delegate: {
      receivedFile: opts.handlers.receivedFile,
      started: opts.handlers.started,
      progress: opts.handlers.progress,
      finished: opts.handlers.finished,
      errorMessage: opts.handlers.errorMessage,
    },
    fetcher: opts.fetcher,
  });
