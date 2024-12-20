import { PluginItem } from "@babel/core";
import * as Babel from "@babel/standalone";
import { transform } from "./babel";

const t = Babel.packages.types;

const runFunctionProcessorPlugin: PluginItem = {
  name: "run-function-processor",
  visitor: {
    ExportNamedDeclaration(path) {
      const node = path.node;
      const declaration = node.declaration;

      if (t.isFunctionDeclaration(declaration) && t.isIdentifier(declaration.id, { name: "run" })) {
        // export function run() {...}
        const funcExpr = t.functionExpression(
          t.identifier("run"),
          declaration.params,
          declaration.body,
          declaration.generator,
          declaration.async,
        );
        path.replaceWith(t.returnStatement(funcExpr));
      } else if (
        t.isVariableDeclaration(declaration) &&
        declaration.declarations.length === 1 &&
        t.isVariableDeclarator(declaration.declarations[0]) &&
        t.isIdentifier(declaration.declarations[0].id, { name: "run" })
      ) {
        const init = declaration.declarations[0].init;
        if (t.isArrowFunctionExpression(init)) {
          // export const run = () => {...}
          const functionBody = t.isBlockStatement(init.body)
            ? init.body
            : t.blockStatement([t.returnStatement(init.body)]);
          const funcExpr = t.functionExpression(
            t.identifier("run"),
            init.params,
            functionBody,
            init.generator,
            init.async,
          );
          path.replaceWith(t.returnStatement(funcExpr));
        } else if (t.isFunctionExpression(init)) {
          // export const run = function() {...}
          const funcExpr = t.functionExpression(
            t.identifier("run"),
            init.params,
            init.body,
            init.generator,
            init.async,
          );
          path.replaceWith(t.returnStatement(funcExpr));
        }
      }
    },

    ExportDefaultDeclaration(path) {
      const { node } = path;
      const decl = node.declaration;

      if (
        t.isFunctionDeclaration(decl) ||
        t.isArrowFunctionExpression(decl) ||
        t.isFunctionExpression(decl)
      ) {
        const functionBody = t.isBlockStatement(decl.body)
          ? decl.body
          : t.blockStatement([t.returnStatement(decl.body)]);

        const funcExpr = t.functionExpression(
          t.identifier("run"),
          decl.params,
          functionBody,
          decl.generator,
          decl.async,
        );

        path.replaceWith(t.returnStatement(funcExpr));
      }
    },
  },
};

export const stripExportsPlugin: PluginItem = {
  name: "strip-exports",
  visitor: {
    ExportNamedDeclaration(path) {
      const { node } = path;
      if (node.declaration) {
        path.replaceWith(node.declaration);
      } else {
        path.remove();
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;
      if (node.declaration) {
        path.replaceWith(node.declaration);
      } else {
        path.remove();
      }
    },
  },
};

export const bundleBenchmarkCode = (code: string, setupCode: string, filename?: string) => {
  return transform(`${setupCode}\n\n${code}`, filename, [runFunctionProcessorPlugin, stripExportsPlugin]);
};
